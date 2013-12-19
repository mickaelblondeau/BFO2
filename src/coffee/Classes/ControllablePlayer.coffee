class ControllablePlayer extends Player
  constructor: (x, y) ->
    super(x, y)
    @speed = 0.3
    @fallingSpeed = 6
    @falling = true
    @alive = true
    @jumpSpeed = 0.3
    @jumpHeight = 80
    @jumpMax = 1
    @jump = false
    @canJump = true
    @jumpStart = 0
    @jumpCount = 0

    @couched = false

    @actualCollisions = []

  reset: ->
    @shape.setX(200)
    @shape.setY(256)
    @alive = true

  kill: ->
    @shape.setX(32)
    @shape.setY(32)
    @alive = false

  update: (frameTime) ->
    if @alive
      collide = @testDiff()
      if collide and collide.getName() is 'falling'
        @kill()

      if !@jump
        @doFall()
      else
        @doJump(frameTime)

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

      HTML.query('#jump').textContent = @jump
      HTML.query('#jumps').textContent = @jumpCount + '/' + @jumpMax
      HTML.query('#falling').textContent = @falling
      HTML.query('#alive').textContent = @alive

  doFall: ->
    if @jumpCount is 0
      @jumpCount = 1
    collide = @testMove(0, @shape.getY() + @fallingSpeed)
    if collide
      @stopFall(collide.getY())

  stopFall: (y) ->
    @shape.setY(y - @shape.getHeight())
    @jumpCount = 0

  startJump: ->
    @canJump = false
    if @jumpCount < @jumpMax and !@couched
      @jumpCount++
      @jump = true
      @jumpStart = @shape.getY()

  doJump: (frameTime) ->
    if(@jumpStart - @shape.getY() < @jumpHeight)
      collide = @testMove(0, @shape.getY() - @jumpSpeed*frameTime)
      if collide
        @shape.setY(collide.getY() + collide.getHeight())
        @stopJump()
      @jumpTime += frameTime
    else
      @stopJump()

  stopJump: ->
    @jump = false

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