class ControllablePlayer extends Player
  constructor: () ->
    super()
    @speed = config.playerSpeed
    @couchedSpeedRatio = 0.5
    @fallMinAcceleration = 0.2
    @fallMaxAcceleration = 0.6
    @fallAcceleration = 1.05
    @fallCurrentAcceleration = @fallMinAcceleration
    @jumpMinAcceleration = 0.1
    @jumpMaxAcceleration = 0.6
    @jumpDeceleration = 0.95
    @jumpCurrentAcceleration = 0
    @jumpHeight = config.playerJumpHeight
    @jumpMax = config.playerJumpMax
    @jump = false
    @canJump = true
    @jumpStart = 0
    @jumpCount = 0
    @couched = false
    @falling = true
    @grabbing = false
    @canGrab = false
    @coopJump = false
    @alive = true
    @actualCollisions = []
    @cached = {}

  update: (frameTime) ->
    @sliding = false

    if !@testMove(0, @shape.getY())
      @falling = true

    if !@jump and !@grabbing
      @doFall(frameTime)
    else
      @doJump(frameTime)

    if @couched and !@jump
      moveSpeed = @speed*frameTime*@couchedSpeedRatio
    else
      moveSpeed = @speed*frameTime

    if @alive
      moveSide = 0

      if @shape.getY() > 1000
        @kill()

      if keyboard.keys.left
        collide = @testMove(@shape.getX() - moveSpeed, 0)
        if collide
          @shape.setX(collide.getX() + collide.getWidth())
        else
          moveSide = -1
      if keyboard.keys.right
        collide = @testMove(@shape.getX() + moveSpeed, 0)
        if collide
          @shape.setX(collide.getX() - @shape.getWidth())
        else
          moveSide = 1
      if keyboard.keys.up
        if @canJump
          @startJump()
      else
        @canJump = true
      if keyboard.keys.down
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

    if @cached.x != @shape.getX() or @cached.y != @shape.getY()
      networkManager.sendMove(@shape.getX(), @shape.getY())
      @cached.x = @shape.getX()
      @cached.y = @shape.getY()

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
    collide = @testMove(0, @shape.getY() + @fallCurrentAcceleration*frameTime)
    tmpAcceleration = @fallCurrentAcceleration*@fallAcceleration
    if tmpAcceleration <= @fallMaxAcceleration
      @fallCurrentAcceleration = tmpAcceleration
    else
      @fallCurrentAcceleration = @fallMaxAcceleration
    if collide
      @stopFall(collide.getY())
    else
      @falling = true

  stopFall: (y) ->
    @shape.setY(y - @shape.getHeight())
    @jumpCount = 0
    @fallCurrentAcceleration = @fallMinAcceleration
    @falling = false

  startJump: ->
    @canJump = false
    if @jumpCount < @jumpMax and !@couched
      if @playerCollision()
        @coopJump = true
        @jumpHeight += 40
      @jumpCount++
      @jump = true
      @jumpCurrentAcceleration = @jumpMaxAcceleration
      @jumpStart = @shape.getY()

  doJump: (frameTime) ->
    if(@jumpStart - @shape.getY() < @jumpHeight) and @jump
      collide = @testMove(0, @shape.getY() - @jumpCurrentAcceleration*frameTime)
      tmpAcceleration = @jumpCurrentAcceleration*@jumpDeceleration
      if tmpAcceleration >= @jumpMinAcceleration
        @jumpCurrentAcceleration = tmpAcceleration
      else
        @jumpCurrentAcceleration = @jumpMinAcceleration
      if collide
        @shape.setY(collide.getY() + collide.getHeight())
        @stopJump()
      @jumpTime += frameTime
    else
      @stopJump()

  stopJump: ->
    @jump = false
    @falling = true
    if @coopJump
      @coopJump = false
      @jumpHeight -= 40

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

  getCollisions: ->
    result = []
    playerBoundBox = collisionManager.getBoundBox(@shape)
    cubes = staticCubes.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push(cube)
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push(cube)
    return result

  testMove: (x, y) ->
    if x isnt 0
      @shape.setX(x)
    if y isnt 0
      @shape.setY(y)
    collisions = @getCollisions()
    for collision in collisions
        if collision.getName() isnt undefined and collision.getName() isnt null
          if collision.getName().type is 'bonus' and @alive
            @takeBonus(collision)
          if collision.getName().type is 'boss'
            @collideBoss(collision)
          if collision.getName().type is 'effect'
            @collideEffect(collision)
          if collision.getName().type is 'cube'
            if collision.getName().falling and collision.getY() + collision.getHeight() - 16 < @shape.getY()
              @kill()
            return collision
        else
          return collision
    return false

  takeBonus: (bonus) ->
    bonusManager.getBonus(bonus.getName().name, @, bonus.getId())
    bonus.destroy()
    dynamicEntities.draw()
    networkManager.sendBonusTaken(bonus.getId())

  changeAnimation: (animation) ->
    if @skin.getAnimation() != animation
      @skin.setAnimation(animation)
      networkManager.sendAnimation(animation)

  changeSide: (side) ->
    super(side)
    networkManager.sendAnimationSide(side)

  collideBoss: (boss) ->
    @kill()

  collideEffect: (effect) ->
    if effect.getName().name is 'ice'
      @sliding = true

  getCornerCollisions: ->
    self = @
    count = 0
    playerBoundBox = collisionManager.getBoundBox(@shape)
    playerBoundBox.left -= 4
    playerBoundBox.right += 4
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if !cube.getName().falling and cube.getName().type is 'cube'
        cubeBoundBox = collisionManager.getBoundBox(cube)
        if collisionManager.colliding(playerBoundBox, cubeBoundBox) and ((cubeBoundBox.left < playerBoundBox.left and self.skin.getScaleX() is -1) or (cubeBoundBox.left > playerBoundBox.left and self.skin.getScaleX() is 1))
          if collisionManager.collidingCorners(playerBoundBox, cubeBoundBox)
            if self.canGrab
              self.grab(cube)
              count++
            else
              players.find('Rect').each (plr) ->
                skin = players.find('#skin-' + plr.getId())[0]
                if plr.getId() isnt undefined
                  if plr.getName() is 'otherPlayer' and skin.getAnimation() is 'couch'
                    otherPlayerBoundBox = collisionManager.getBoundBox(plr)
                    otherPlayerBoundBox.bottom += 4
                    if collisionManager.colliding(playerBoundBox, otherPlayerBoundBox)
                      self.grab(cube)
                      count++
    if count is 0
      @grabbing = false

  playerCollision: ->
    response = false
    playerBoundBox = collisionManager.getBoundBox(@shape)
    players.find('Rect').each (plr) ->
      if plr.getId() isnt undefined
        skin = players.find('#skin-' + plr.getId())[0]
        if plr.getName() is 'otherPlayer' and skin.getAnimation() is 'couch'
          otherPlayerBoundBox = collisionManager.getBoundBox(plr)
          if collisionManager.colliding(playerBoundBox, otherPlayerBoundBox)
            response = true
    return response

  grab: (cube) ->
    if !@grabbing
      @stopJump()
      @grabbing = true
      @jumpCount = 0
      @shape.setY(cube.getY())

  kill: ->
    super()
    if @alive
      networkManager.sendDie()