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
    @alive = true
    @actualCollisions = []

  update: (frameTime) ->
    if @alive
      collide = @testDiff()
      if collide and collide.getName() is 'falling'
        @kill()
        networkManager.sendDie()
      else if collide and collide.getName().split(' ')[0] is 'bonus'
        @takeBonus(collide)

      moveSide = 0

      if @jump or @falling or keyboard.keys.left or keyboard.keys.right or keyboard.keys.up or keyboard.keys.down
        if !@jump
          @doFall(frameTime)
        else
          @doJump(frameTime)

        if @couched and !@jump
          moveSpeed = @speed*frameTime*@couchedSpeedRatio
        else
          moveSpeed = @speed*frameTime

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

        networkManager.sendMove(@shape.getX(), @shape.getY())

      else if @couched
        @stopCouch()
        networkManager.sendMove(@shape.getX(), @shape.getY())

      else if !keyboard.keys.up
        @canJump = true

      if moveSide is -1 and @skin.getScaleX() != -1
        @changeSide(-1)
      else if moveSide is 1 and @skin.getScaleX() != 1
        @changeSide(1)

      if @jump

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

      @fixSkinPos()

      HTML.query('#jump').textContent = @jump
      HTML.query('#jumps').textContent = @jumpCount + '/' + @jumpMax
      HTML.query('#falling').textContent = @falling
      HTML.query('#alive').textContent = @alive
      HTML.query('#ppc').textContent = !(@jump or @falling or keyboard.keys.left or keyboard.keys.right or keyboard.keys.up or keyboard.keys.down)

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
      @jumpCount++
      @jump = true
      @jumpCurrentAcceleration = @jumpMaxAcceleration
      @jumpStart = @shape.getY()

  doJump: (frameTime) ->
    if(@jumpStart - @shape.getY() < @jumpHeight)
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

  startCouch: ->
    if !@couched
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
    cubes = fallingCubes.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push(cube)
    return result

  testMove: (x, y) ->
    list = @getCollisions()
    if x isnt 0
      @shape.setX(x)
    if y isnt 0
      @shape.setY(y)
    collisions = @getCollisions()
    for collision in collisions
      if collision not in list
        if (x isnt 0 and collision.getY() isnt @shape.getY() + @shape.getHeight()) or (y isnt 0 and collision.getX() isnt @shape.getX() + @shape.getWidth() and collision.getX() + collision.getWidth() isnt @shape.getX())
          if !(collision.getName() isnt undefined and collision.getName() isnt null and collision.getName().split(' ')[0] is 'bonus')
            return collision

    for collision in collisions
      if collision not in list
        if collision.getName() isnt undefined and collision.getName() isnt null and collision.getName().split(' ')[0] is 'bonus'
          @takeBonus(collision)
          return false

    return false

  testDiff: ->
    collisions = @getCollisions()
    for collision in collisions
      if collision not in @actualCollisions
        @actualCollisions = collisions
        return collision
    @actualCollisions = collisions
    return false

  takeBonus: (bonus) ->
    bonusManager.getBonus(bonus.getName().split(' ')[1], @)
    bonus.destroy()
    fallingCubes.draw()
    networkManager.sendBonusTaken(bonus.getId())

  changeAnimation: (animation) ->
    super(animation)
    networkManager.sendAnimation(animation)

  changeSide: (side) ->
    super(side)
    networkManager.sendAnimationSide(side)