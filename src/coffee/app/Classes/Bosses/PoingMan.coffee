class PoingMan extends MultiPartBoss
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
    @parts.push(new PoingManPart(128 - 128, @levelHeight - 64))
    @parts.push(new PoingManPart(512 + 128, @levelHeight - 64))
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
      else
        @shape.setX(tmp)
    else if @shape.getX() < dest and @oldPos < dest
      tmp = @shape.getX() + @speed * frameTime
      if tmp > dest
        @shape.setX(dest)
        @oldPos = @shape.getX()
        @attacking = true
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
        @waiting = true
        if @attacks[@index] is undefined
          @finishing = true
          @regenMap()
      else
        contentLoader.play('explosion')
        @comeBack = true
        collisions = cubeManager.getCollisions(@shape)
        for collision in collisions
          collision.destroy()
        staticCubes.draw()

  startingPhase: (frameTime) ->
    tmp = @parts[0].shape.getX() + @speed * frameTime
    if tmp > 128
      @parts[0].shape.setX(128)
    else
      @parts[0].shape.setX(tmp)

    tmp = @parts[1].shape.getX() - @speed * frameTime
    if tmp < 512
      @parts[1].shape.setX(512)
    else
      @parts[1].shape.setX(tmp)

    @shape.setX(@shape.getX() - @speed * frameTime)
    if(@shape.getX() < 64)
      @starting = false

  finishingPhase: (frameTime) ->
    @parts[0].shape.setX(@parts[0].shape.getX() - @speed * frameTime)
    @parts[1].shape.setX(@parts[1].shape.getX() + @speed * frameTime)
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