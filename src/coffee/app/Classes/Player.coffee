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
      stroke: null
    players.add @shape

    @skin = new Kinetic.Shape
      drawFunc: (context) ->
        context.beginPath()
        context.arc(16, 10, 10, 0, 180, false)
        context.moveTo(0, 62)
        context.lineTo(32, 62)
        context.lineTo(16, 22)
        context.closePath()
        context.fillStrokeShape(@)
      fill: 'red'
      stroke: 'black'
    players.add @skin

  spawn: ->
    @shape.setX(336)
    @shape.setY(stage.getY() * -1)

  reset: ->
    @spawn()
    @alive = true
    @falling = true
    @jumpMax = config.jumpMax
    @speed = config.playerJumpMax
    @jumpHeight = config.playerJumpHeight

  kill: ->
    @shape.setX(32)
    @shape.setY(32)
    @skin.setX(32)
    @skin.setY(32)
    @alive = false