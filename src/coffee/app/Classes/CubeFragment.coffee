class CubeFragment extends Cube
  constructor: (x, y, size) ->
    anim = size.x + '-' + size.y
    super(x, y, size, @getSpriteSheet(), anim)
    dynamicEntities.add @shape
    @shape.draw()

  getSpriteSheet: ->
    sheets = ["cubes_red", "cubes_green", "cubes_blue"]
    return sheets[Math.floor((Math.random()*sheets.length))]