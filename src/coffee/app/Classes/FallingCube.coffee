class FallingCube extends Cube
  constructor: (col, size) ->
    x = col * 32 + 160
    y = stage.getY() * -1
    anim = size.x + '-' + size.y
    super(x, y, size, @getSpriteSheet(), anim)
    dynamicEntities.add @shape
    @shape.setName({ type: 'cube', falling: true })
    @shape.draw()

  getSpriteSheet: ->
    sheets = ["cubes_red", "cubes_green", "cubes_blue"]
    return sheets[Math.floor((Math.random()*sheets.length))]