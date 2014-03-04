class StaticCube extends Sprite
  constructor: (x, y, size) ->
    anim = size.x + '-' + size.y
    super(x, y, size, 'cubes', anim)
    staticCubes.add @shape
    @shape.draw()