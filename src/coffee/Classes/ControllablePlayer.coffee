class ControllablePlayer extends Player
  constructor: (x, y) ->
    super(x, y)
    @speed = 0.25
    @couchSpeed = 0.1
    @move = { left: false, right: false }

    @fallingSpeed = 6
    @maxJump = 1
    @numJump = 1
    @jump = false
    @jumpLaunched = false
    @canJump = true

    @countCollisions = 0
    @falling = true
    @couched = false
    @stopCouch = false
    @tween = null
    @lockDirection = { left: false, right: false }

    @alive = true

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
      if @couched and !@falling
        moveSpeed = @couchSpeed*frameTime
      else
        moveSpeed = @speed*frameTime
      @checkCollisions()
      if keyboard.keys.left and !@lockDirection.left
        @shape.setX(@shape.getX() - moveSpeed)
      if keyboard.keys.right and !@lockDirection.right
        @shape.setX(@shape.getX() + moveSpeed)
      if keyboard.keys.down and !@couched
        @couch()
      else if !keyboard.keys.down and @couched
        @wake()
      if keyboard.keys.up and !@jump and !@falling and @canJump and !@couched
        @startJump()
      if @couched and @stopCouch
        @wake()
      if !@jump and @falling
        @doFall()

      HTML.query('#jump').textContent = @jump
      HTML.query('#jumps').textContent = @numJump + "/" + @maxJump
      HTML.query('#falling').textContent = !@jump and @falling
      HTML.query('#alive').textContent = @alive

  doJump: ->
    player = @
    @jumpLaunched = true
    @tween = new Kinetic.Tween
      node: @shape
      duration: 0.3
      easing: Kinetic.Easings.EaseOut
      y: @shape.getY() - 84
      onFinish: ->
        player.stopJump()
    @tween.play()

  doFall: ->
    @shape.setY(@shape.getY() + @fallingSpeed)

  couch: ->
    if @couched is false
      @shape.setHeight(@heightCouched)
      @shape.setY(player.shape.getY() + (@height - @heightCouched))
      @couched = true

  wake: ->
    @shape.setHeight(@height)
    @shape.setY(player.shape.getY() - (@height - @heightCouched))
    @couched = false
    if @getCountCollisions() > @countCollisions
      @shape.setHeight(@heightCouched)
      @shape.setY(player.shape.getY() + (@height - @heightCouched))
      @couched = true
    else
      @stopCouch = false

  startJump: ->
    @canJump = false
    @jump = true
    @doJump()

  stopJump: ->
    @numJump++
    @jump = false
    @jumpLaunched = false

  cancelJump: ->
    @stopJump()
    if @tween isnt null
      @tween.pause()

  stopFall: (y) ->
    @falling = false
    @canJump = true
    @numJump = 0
    @shape.setY(y - @shape.getHeight())

  stopDirection: (way, x) ->
    if way is 'left'
      @lockDirection.left = true
      @shape.setX(x)
    else
      @lockDirection.right = true
      @shape.setX(x - @shape.getWidth())

  checkCollisions: ->
    player = @
    @falling = true
    @lockDirection.left = false
    @lockDirection.right = false
    collisions = @getCollisions()
    @countCollisions = collisions.length
    for collision in collisions
      if collision.sides.top
        player.stopFall(collision.cube.getY())
      else
        if collision.sides.bot
          if collision.cube.getName() is 'falling'
            player.kill()
          player.cancelJump()
        if collision.sides.left
          player.stopDirection('left', collision.cube.getX() + collision.cube.getWidth())
        else if collision.sides.right
          player.stopDirection('right', collision.cube.getX())

  getCollisions: ->
    result = []
    playerBoundBox = collisionManager.getBoundBox(@shape)
    cubes = staticCubes.find('Rect')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push
          cube: cube
          sides: collisionManager.getSide(playerBoundBox, cubeBoundBox)
    cubes = fallingCubes.find('Rect')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(playerBoundBox, cubeBoundBox)
        result.push
          cube: cube
          sides: collisionManager.getSide(playerBoundBox, cubeBoundBox)
    return result

  getCountCollisions: ->
    return @getCollisions().length