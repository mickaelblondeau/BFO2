class ControllablePlayer extends Player
  constructor: (x, y) ->
    super(x, y)
    @speed = 0.3
    @couchedSpeedRatio = 0.5
    @fallMinAcceleration = 0.2
    @fallMaxAcceleration = 0.6
    @fallAcceleration = 1.05
    @fallCurrentAcceleration = @fallMinAcceleration
    @jumpMinAcceleration = 0.1
    @jumpMaxAcceleration = 0.6
    @jumpDeceleration = 0.95
    @jumpCurrentAcceleration = 0
    @jumpHeight = 80
    @jumpMax = 1
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
        if keyboard.keys.right
          collide = @testMove(@shape.getX() + moveSpeed, 0)
          if collide
            @shape.setX(collide.getX() - @shape.getWidth())

        if keyboard.keys.up
          if @canJump
            @startJump()
        else
          @canJump = true

        if keyboard.keys.down
          @startCouch()
        else
          @stopCouch()

      else if @couched
        @stopCouch()

      else if !keyboard.keys.up
        @canJump = true

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
    cubes = staticCubes.find('Rect')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push(cube)
    cubes = fallingCubes.find('Rect')
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
        if x isnt 0 and collision.getY() isnt @shape.getY() + @shape.getHeight()
          return collision
        if y isnt 0 and collision.getX() isnt @shape.getX() + @shape.getWidth() and collision.getX() + collision.getWidth() isnt @shape.getX()
          return collision
    return false

  testDiff: ->
    collisions = @getCollisions()
    for collision in collisions
      if collision not in @actualCollisions
        @actualCollisions = collisions
        return collision
    @actualCollisions = collisions
    return false