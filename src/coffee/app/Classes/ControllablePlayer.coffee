class ControllablePlayer extends Player
  constructor: (skin) ->
    super(skin)
    @reinitStats()

  reinitStats: ->
    @speed = config.player.speed + bonusManager.findBonus('speedBonus').value * bonusManager.playerBonuses.speedBonus
    @jumpHeight = config.player.jumpHeight
    @jumpMax = config.player.jumpMax
    @couchedSpeedRatio = config.player.couchedSpeedRation
    @jump = false
    @canJump = true
    @jumpStart = 0
    @jumpCount = 0
    @couched = false
    @falling = true
    @grabbing = false
    @grabbed = false
    @coopJump = false
    @alive = true
    @stomped = false
    @actualCollisions = []
    @cached = {}

    @addJumpHeight(bonusManager.findBonus('jumpHeightBonus').value * bonusManager.playerBonuses.jumpHeightBonus)

    @maxV = config.player.maxV
    @maxJumpV = config.player.maxV
    @minV = config.player.minV
    @vAcc = config.player.vAcc
    @vDecc = config.player.vDecc
    @vy = @minV

  reset: ->
    @reinitStats()
    @spawn()

  update: (frameTime) ->
    if !(!@alive and @shape.getY() > stage.getY()*-1 + stage.getHeight())
      @sliding = false
      @slowed = false

      if !collisionManager.checkPresence(@shape.getX() + @shape.getWidth()/2, @shape.getY() + @shape.getHeight() + 8)
        @falling = true

      if !@jump and !@grabbing and @falling
        @doFall(frameTime)
      else if @jump
        @doJump(frameTime)

      if @couched and !@jump
        moveSpeed = @speed*frameTime*@couchedSpeedRatio
      else
        moveSpeed = @speed*frameTime

      if @slowed
        moveSpeed = moveSpeed / 2
        @canJump = false

      if @alive
        moveSide = 0

        if @shape.getY() > 1000
          @kill()

        if keyboard.keys.left
          collide = @testMove(@shape.getX() - moveSpeed, 0)
          if collide
            @shape.setX(collide.getX() + collide.getWidth())
          if moveSide != -1
            moveSide = -1
        else if keyboard.keys.right
          collide = @testMove(@shape.getX() + moveSpeed, 0)
          if collide
            @shape.setX(collide.getX() - @shape.getWidth())
          if moveSide != 1
            moveSide = 1
        if keyboard.keys.up
          if @canJump
            @startJump()
        else
          @canJump = true
        if keyboard.keys.down and !@falling and !@jump
          @startCouch()
        else
          @stopCouch()

        if @jump
          @changeAnimation('jump')
        else if @grabbing
          @changeAnimation('grabbing')
        else if @falling
          @changeAnimation('fall')
        else if @couched
          if moveSide isnt 0
            @changeAnimation('couchMove')
          else
            @changeAnimation('couch')
        else if moveSide isnt 0
          @changeAnimation('run')
        else
          @changeAnimation('idle')

        @getCornerCollisions()

        if moveSide is -1 and @skin.getScaleX() != -1
          @changeSide(-1)
        else if moveSide is 1 and @skin.getScaleX() != 1
          @changeSide(1)
      else
        @changeAnimation('dead')

      @fixSkinPos()

      if @cached.x != @shape.getX() or @cached.y != @shape.getY() or @cached.animation != @skin.getAnimation()
        networkManager.sendMove(@shape.getX(), @shape.getY())
        @cached.x = @shape.getX()
        @cached.y = @shape.getY()
        @cached.animation = @skin.getAnimation()

      if @sliding
        if @skin.getScaleX() is -1
          collide = @testMove(@shape.getX() - (@speed*frameTime)/2, 0)
          if collide
            @shape.setX(collide.getX() + collide.getWidth())
        else
          collide = @testMove(@shape.getX() + (@speed*frameTime)/2, 0)
          if collide
            @shape.setX(collide.getX() - @shape.getWidth())

  doFall: (frameTime) ->
    if @jumpCount is 0
      @jumpCount = 1
    console.log 'falling'
    collide = @testMove(0, @shape.getY() + @vy*frameTime)
    tmpAcc = @vy*@vAcc
    if tmpAcc <= @maxJumpV
      @vy = tmpAcc
    else
      @vy = @maxJumpV
    if collide
      @stopFall(collide.getY())
    else
      @falling = true

  stopFall: (y) ->
    @shape.setY(y - @shape.getHeight())
    @jumpCount = 0
    @falling = false
    @vy = @minV

  startJump: ->
    @canJump = false
    if !@couched and @jumpCount is 0 or (@jumpCount < @jumpMax and bonusManager.playerBonuses.doubleJumpBonus > 0)
      if @jumpCount > 0
        bonusManager.playerBonuses.doubleJumpBonus--
      if collisionManager.getPlayerCollision()
        @coopJump = true
        @addTempheight(@jumpHeight + 40)
      @jumpCount++
      @jump = true
      @jumpStart = @shape.getY()
      @vy = @maxV

  doJump: (frameTime) ->
    if(@jumpStart - @shape.getY() < @jumpHeight) and @jump
      collide = @testMove(0, @shape.getY() - @vy*frameTime)
      tmpAcc = @vy*@vDecc
      if tmpAcc >= @minV
        @vy = tmpAcc
      else
        @vy = @minV
      if collide
        @shape.setY(collide.getY() + collide.getHeight())
        @stopJump()
      @jumpTime += frameTime
    else
      @stopJump()

  stopJump: ->
    @jump = false
    @falling = true
    if @stomped or @coopJump
      @reinitJump()

  reinitJump: ->
    @jumpHeight = @oldStats.jumpHeight
    @maxV = @oldStats.maxV
    @vDecc = @oldStats.vDecc
    @stomped = false
    @coopJump = false

  startCouch: ->
    if !@couched and !@grabbing
      @couched = true
      @shape.setHeight(@heightCouched)
      @shape.setY(@shape.getY() + @height - @heightCouched)

  stopCouch: ->
    if @couched
      @couched = false
      @shape.setHeight(@height)
      collide = @testMove(0, @shape.getY() - @height + @heightCouched)
      if collide
        @startCouch()

  testMove: (x, y) ->
    if x isnt 0
      @shape.setX(x)
    if y isnt 0
      @shape.setY(y)
    collisions = collisionManager.getAllCollisions(@shape)
    for collision in collisions
        if collision.getName() isnt undefined and collision.getName() isnt null
          if collision.getName().type is 'bonus' and @alive
            @takeBonus(collision)
          if collision.getName().type is 'boss'
            @collideBoss(collision)
          if collision.getName().type is 'effect'
            @collideEffect(collision)
          if collision.getName().type is 'cube' or collision.getName().type is 'special'
            if collision.getName().falling and collision.getY() + collision.getHeight() - 16 < @shape.getY()
              @kill()
            return collision
        else
          return collision
    return false

  takeBonus: (bonus) ->
    if bonusManager.getBonus(bonus.getName().name)
      bonus.destroy()
      networkManager.sendBonusTaken(bonus.getId())

  changeAnimation: (animation) ->
    if @skin.getAnimation() != animation
      @skin.setAnimation(animation)
      networkManager.sendAnimation(@getIndexByAnimation(animation))

  changeSide: (side) ->
    super(side)
    networkManager.sendAnimationSide(side)

  collideBoss: (boss) ->
    @kill()

  collideEffect: (effect) ->
    if effect.getName().name is 'ice'
      @sliding = true
    if effect.getName().name is 'slow'
      @slowed = true
    if effect.getName().name is 'jumpBlock' and @falling and !@jump
      @addTempheight(256)
      @jumpStart = player.shape.getY()
      @jumpCount = player.jumpMax
      @stomped = true
      @jump = true

  getCornerCollisions: ->
    grab = false
    collisions = collisionManager.getCornerCollisions()
    playerCollision = collisionManager.getPlayerCollision()
    for collision in collisions
      if playerCollision
        @grab(collision, false)
        grab = true
        break
      else if bonusManager.playerBonuses.grabbingBonus > 0
        @grab(collision, true)
        grab = true
        break
    if !grab
      @grabbing = false
      @stopGrab()

  grab: (cube, bonusGrab) ->
    if !@grabbing
      @stopJump()
      @grabbing = true
      @jumpCount = 0
      @shape.setY(cube.getY())
      if bonusGrab
        @grabbed = true

  stopGrab: ->
    if @grabbed
      bonusManager.playerBonuses.grabbingBonus--
      @grabbed = false

  kill: ->
    if @alive
      @alive = false
      contentLoader.play('death')
      new Effect(@shape.getX() - 16, @shape.getY(), SquareEnum.SMALL, 'blood', true)
      networkManager.sendDie()
      if bonusManager.playerBonuses.autoRezBonus > 0
        bonusManager.playerBonuses.autoRezBonus--
        @reset()
      else
        @lootBonus()
        bonusManager.resetBonuses()

  lootBonus: ->
    id = bonusManager.getRandomBonus()
    if id isnt undefined
      networkManager.sendLootBonus(Math.round(@shape.getX()/32)*32, Math.floor((@shape.getY() + @shape.getHeight())/32)*32-32, id)

  useTp: ->
    if bonusManager.playerBonuses.tpBonus > 0
      bonusManager.playerBonuses.tpBonus--
      networkManager.sendTp()
      new Effect(@shape.getX() - 24, @shape.getY(), SquareEnum.SMALL, 'tp', null, true)

  useJumpBlock: ->
    if bonusManager.playerBonuses.jumpBlockBonus > 0
      bonusManager.playerBonuses.jumpBlockBonus--
      networkManager.sendJumpBlock(Math.round(@shape.getX()/32)*32, Math.floor((@shape.getY() + @shape.getHeight())/32)*32-32)

  addJumpHeight: (h) ->
    @jumpHeight += h
    @maxV += h/200
    @vDecc += h/5000

  addTempheight: (h) ->
    @oldStats = {
      jumpHeight: @jumpHeight
      maxV: @maxV
      vDecc: @vDecc
    }
    @jumpHeight = h
    @maxV += h/500
    @vDecc = 0.999
    @vy = @maxV