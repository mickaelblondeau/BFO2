class Player
  constructor: () ->
    @heightCouched = 30
    @height = 62
    @draw()
    @spawn()

  draw: ->
    @shape = new Kinetic.Rect
      width: 32
      height: @height
      stroke: 'black'
      strokeWidth: 1
    players.add @shape

  spawn: ->
    @shape.setX(336)
    @shape.setY(stage.getY() * -1)

  reset: ->
    @spawn()
    @alive = true
    @falling = true

  kill: ->
    @shape.setX(32)
    @shape.setY(32)
    @alive = false