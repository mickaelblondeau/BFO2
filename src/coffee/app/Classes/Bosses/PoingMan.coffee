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
    @originSpeed = @speed
    @index = 0

    @start()

  start: ->
    @destroyGround()
    @regenMap()

    self = @
    bossManager.update = (frameTime) ->
      if self.attacking and !self.finishing and !self.starting and !self.waiting
        if !self.comeBack && self.move(frameTime, self.shape.getX(), self.levelHeight - 62)
          self.destroyBlocks()
        else if self.move(frameTime, self.shape.getX(), self.y)
          self.finishAttack()
      else if !self.finishing and !self.starting and !self.waiting
        if self.move(frameTime, self.attacks[self.index]*32 + 160, self.shape.getY())
          self.attacking = true
          self.waiting = true
          self.speed = self.attackSpeed
      else if !self.starting and !self.waiting
        if self.move(frameTime, 800, self.shape.getY())
          self.finish()
      else if !self.waiting
        if self.move(frameTime, 0, self.shape.getY())
          self.starting = false
      else
        self.wait(frameTime)

  finishAttack: ->
    @index++
    @attacking = false
    @comeBack = false
    @speed = @originSpeed
    if @attacks[@index] is undefined
      @finishing = true
      @regenMap()

  destroyBlocks: ->
    contentLoader.play('explosion')
    @comeBack = true
    collisions = collisionManager.getStaticCollisions(@shape)
    for collision in collisions
      if collision.getName() is undefined or collision.getName().broken isnt true
        for i in [0..(collision.getWidth()/32)-1]
          cube = new Sprite(collision.getX() + i * 32, collision.getY(), SquareEnum.SMALL, 'cubes', 'brokenCube')
          cube.shape.setName({ type: 'cube', broken: true })
          staticCubes.add cube.shape
      collision.destroy()
    staticCubes.draw()

  destroyGround: ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      cube.destroy()
    cubes = staticCubes.find('Sprite')
    cubes.each (cube) ->
      if cube.getX() > 128 and cube.getX() < 544
        cube.destroy()

  regenMap: ->
    for i in [1..12]
      new StaticCube(i*32 + 128, @levelHeight, SquareEnum.SMALL)

  wait: (frameTime) ->
    @time += frameTime
    if @time >= @waitTime
      @time = 0
      @waiting = false