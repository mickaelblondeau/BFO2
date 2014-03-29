class CubeFragment extends Sprite
  constructor: (x, y, size) ->
    anim = size.x + '-' + size.y
    super(x, y, size, @getSpriteSheet(), anim)
    dynamicEntities.add @shape
    @shape.setName({ type: 'cube' })
    @shape.draw()