class FallingCube extends Sprite
  constructor: (col, size, id) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    anim = size.x + '-' + size.y
    super(x, y, size, @getSpriteSheet(), anim)
    dynamicEntities.add @shape
    @shape.setName({ type: 'cube', falling: true })
    @shape.setId(id)
    cubeManager.lastId = id
    @shape.draw()