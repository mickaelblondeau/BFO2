class SpecialCube extends Cube
  constructor: (col, size, destination, type) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    @type = type
    super(x, y, size, 'cubes_special', type)
    dynamicEntities.add @shape
    @shape.setName('falling')
    @shape.draw()

    @destination = (arena.y - destination * 32 - size.y)
    @diffY = @destination - y
    @speed = 600
    @fall()

  fall: ->
    self = @
    tween = new Kinetic.Tween
      node: @shape
      duration: @diffY/@speed
      y: @destination
      onFinish: ->
        tween.destroy()
        self.doEffect()
        self.shape.destroy()
    tween.play()

  doEffect: ->
    self = @
    if @type is 'iceExplosion'
      dynamicEntities.find('Sprite').each (cube) ->
        if cube.getName() is null
          if cube.getX() < self.shape.getX() + 128 and cube.getX() > self.shape.getX() - 128 and cube.getY() < self.shape.getY() + 128 and cube.getY() > self.shape.getY() - 128
            for i in [0..(cube.getWidth()/32)-1]
                new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'ice')
    if @type is 'explosion'
      dynamicEntities.find('Sprite').each (cube) ->
        if cube.getName() is null
          for i in [-4..5]
            j = i
            if i > 0
              j = i-1
            if cube.getY() < self.shape.getY() - (-5 + Math.abs(j))*32 and cube.getY() > self.shape.getY() + (-5 + Math.abs(j))*32
              if cube.getWidth() > 32 or cube.getHeight() > 32
                for k in [0..(cube.getWidth()/32-1)]
                  for l in [0..(cube.getHeight()/32-1)]
                    new CubeFragment(cube.getX() + k*32, cube.getY() + l*32, SquareEnum.SMALL)
                cube.destroy()
      dynamicEntities.find('Sprite').each (cube) ->
        for i in [-4..5]
          j = i
          if i > 0
            j = i-1
          if cube.getX() is self.shape.getX() + i*32 and cube.getY() < self.shape.getY() - (-5 + Math.abs(j))*32 and cube.getY() > self.shape.getY() + (-5 + Math.abs(j))*32
            cube.destroy()
      if player.shape.getX() < self.shape.getX() + 96 and player.shape.getX() > self.shape.getX() - 96 and player.shape.getY() < self.shape.getY() + 96 and player.shape.getY() > self.shape.getY() - 96
        player.kill()