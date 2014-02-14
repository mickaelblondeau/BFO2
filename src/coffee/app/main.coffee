stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

dynamicEntities = new Kinetic.Layer()
players = new Kinetic.Layer()
staticCubes = new Kinetic.Layer()
staticBg = new Kinetic.Layer()
hudLayer = new Kinetic.Layer()

stage.add staticBg
stage.add players
stage.add staticCubes
stage.add dynamicEntities
stage.add hudLayer

networkManager = new NetworkManager()
contentLoader = new ContentLoader()
collisionManager = new CollisionManager()
keyboard = new Keyboard()
levelManager = new LevelManager()
bonusManager = new BonusManager()
bossManager = new BossManager()
cubeManager = new CubeManager()
skinManager = new SkinManager()

game = new Game()
game.loadAssets()

arena = null
player = null
hud = null
skin = { body: 1, hair: 1, head: 1, leg: 1, shoes: 1, skin: 1 }

if config.debug
  debugLayer = new Kinetic.Layer()
  stage.add debugLayer
  debugLayer.setZIndex(100)
  debugMap = (map) ->
    debugLayer.destroyChildren()
    for subMap, x in map
      for val, y in subMap
        if val isnt null
          shape = new Kinetic.Rect
            x: x * 32 + 160
            y: arena.y - y * 32 - 32
            width: 32
            height: 32
            stroke: "red"
          debugLayer.add shape
    debugLayer.draw()

contentLoader.contentsLoaded = ->
  document.querySelector('#login-form').style.display = 'block'
  document.querySelector('#login-loading').style.display = 'none'
  document.querySelector('#ip').val = window.location.host

  contentLoader.playSong()

  launchGame = (ip, name) ->
    bg = new Kinetic.Rect
      width: stage.getWidth()
      height: stage.getHeight()
      fillPatternImage: contentLoader.images['bg']
    staticBg.add bg
    bg.setZIndex(-1)
    bg.draw()

    arena = new Arena()
    player = new ControllablePlayer(skin)
    hud = new HUD()

    networkManager.connect(ip, name, skin)

    game.update = (frameTime) ->
      players.draw()
      dynamicEntities.draw()
      player.update(frameTime)
      bossManager.update(frameTime)
      hud.update(frameTime)
      cubeManager.update(frameTime)

  document.querySelector('#play').onclick = () ->
    ip = document.querySelector('#ip').value.replace(" ","")
    name = document.querySelector('#name').value
    document.querySelector('#login-form').style.display = 'none'
    document.querySelector('#login-loading').style.display = 'block'
    document.querySelector('#login-loading').innerHTML = 'Waiting for '+ip+'...'
    launchGame(ip, name)
    contentLoader.play('beep')