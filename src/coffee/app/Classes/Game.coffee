animFrame = requestAnimationFrame ||
  webkitRequestAnimationFrame ||
  mozRequestAnimationFrame    ||
  oRequestAnimationFrame      ||
  msRequestAnimationFrame     ||
  null

class Game
  constructor: ->
    @lastFrame = Date.now()
    @statsInit()

  loop: ->
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    animFrame(Game.prototype.loop.bind(@))
    @lastFrame = thisFrame

    game.statsBegin()
    game.update(frameTime)
    game.statsEnd()

  update: (frameTime) ->

  start: ->
    @resize()
    @loop()

  resize: ->
    scale = window.innerHeight/config.levelHeight
    stage.setScaleX(scale)
    stage.setScaleY(scale)
    stage.draw()
    document.getElementById("container").style.width = config.levelWidth * scale + "px"

  statsInit: ->
    @fps = new Stats()
    document.body.appendChild( @fps.domElement )

  statsBegin: ->
    @fps.begin()

  statsEnd: ->
    @fps.end()

  reset: ->
    networkManager.sendReset()

  launch: ->
    networkManager.sendLaunch()