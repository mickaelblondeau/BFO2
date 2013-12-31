class Effect extends Cube
  constructor: (x, y, size, anim) ->
    super(x, y, size, 'effects', anim)
    dynamicEntities.add @shape
    @shape.setName({ type: 'effect', name: anim })
    @shape.draw()