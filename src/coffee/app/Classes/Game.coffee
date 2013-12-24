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
    @scale = 1

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
    @scale = window.innerHeight/config.levelHeight
    stage.setScaleX(@scale)
    stage.setScaleY(@scale)
    stage.draw()
    document.getElementById("container").style.width = config.levelWidth * @scale + "px"

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

  loadAssets: ->
    imageLoader.addLoad({ name:'cubes', url:'../assets/cubes.jpg'})
    imageLoader.addLoad({ name:'cubes_red', url:'../assets/cubes_red.jpg'})
    imageLoader.addLoad({ name:'cubes_blue', url:'../assets/cubes_blue.jpg'})
    imageLoader.addLoad({ name:'cubes_green', url:'../assets/cubes_green.jpg'})
    imageLoader.addLoad({ name:'bonus', url:'../assets/bonus.png'})
    imageLoader.addLoad({ name:'bg', url:'../assets/bg.jpg'})
    imageLoader.addLoad({ name:'boss', url:'../assets/boss.png'})
    imageLoader.addLoad({ name:'playerSpirteSheet', url:'../assets/playerSpirteSheet.png'})
    imageLoader.load()