class PoingMan extends Boss
  constructor: (pattern) ->
    x = 900
    @levelHeight = arena.y - levelManager.levelHeight
    @y = @levelHeight - 256
    super('poingman', x, @y, 64, 64)

    @attacking = false
    @comeBack = false
    @finishing = false
    @starting = true
    @waiting = false
    @time = 0
    @speed = pattern[0][0]
    @attackSpeed = pattern[0][1]
    @waitTime = pattern[0][2]
    @attacks = pattern[1]
    @index = 0

    @oldPos = 0

    @start()

  start: ->
    self = @
    bossManager.update = (frameTime) ->
      if self.attacking and !self.finishing and !self.starting and !self.waiting
        self.attack(frameTime)
      else if !self.finishing and !self.starting and !self.waiting
        self.moveToPosition(frameTime)
      else if !self.starting and !self.waiting
        self.finishingPhase(frameTime)
      else if !self.waiting
        self.startingPhase(frameTime)
      else
        self.wait(frameTime)

  moveToPosition: (frameTime) ->
    dest = @attacks[@index]*32 + 160
    if @shape.getX() >= dest and @oldPos >= dest
      tmp = @shape.getX() - @speed * frameTime
      if tmp < dest
        @shape.setX(dest)
        @oldPos = @shape.getX()
        @attacking = true
        @waiting = true
      else
        @shape.setX(tmp)
    else if @shape.getX() < dest and @oldPos < dest
      tmp = @shape.getX() + @speed * frameTime
      if tmp > dest
        @shape.setX(dest)
        @oldPos = @shape.getX()
        @attacking = true
        @waiting = true
      else
        @shape.setX(tmp)

  attack: (frameTime) ->
    ground = @levelHeight - 62
    if @shape.getY() < ground and !@comeBack
      tmp = @shape.getY() + @attackSpeed * frameTime
      if tmp > ground
        @shape.setY(ground)
      else
        @shape.setY(tmp)
    else if @shape.getY() > @y and @comeBack
      tmp = @shape.getY() - @attackSpeed * frameTime
      if tmp < @y
        @shape.setY(@y)
      else
        @shape.setY(tmp)
    else
      if @comeBack
        @index++
        @attacking = false
        @comeBack = false
        if @attacks[@index] is undefined
          @finishing = true
          @regenMap()
      else
        contentLoader.play('explosion')
        @comeBack = true
        collisions = cubeManager.getCollisions(@shape)
        for collision in collisions
          if collision.getName() is undefined or collision.getName().broken isnt true
            for i in [0..(collision.getWidth()/32)-1]
              cube = new Sprite(collision.getX() + i * 32, collision.getY(), SquareEnum.SMALL, 'cubes', 'brokenCube')
              cube.shape.setName({ type: 'cube', broken: true })
              staticCubes.add cube.shape
          collision.destroy()
        staticCubes.draw()

  startingPhase: (frameTime) ->
    @shape.setX(@shape.getX() - @speed * frameTime)
    if(@shape.getX() < 64)
      @starting = false

  finishingPhase: (frameTime) ->
    @shape.setX(@shape.getX() + @speed * frameTime)
    if(@shape.getX() > 800)
      @finish()

  regenMap: ->
    for i in [1..12]
      new StaticCube(i*32 + 128, @levelHeight, SquareEnum.SMALL)

  wait: (frameTime) ->
    @time += frameTime
    if @time >= @waitTime
      @time = 0
      @waiting = false