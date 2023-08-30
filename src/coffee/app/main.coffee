stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

dynamicEntities = new Kinetic.Layer
  hitGraphEnabled: false
players = new Kinetic.Layer
  hitGraphEnabled: false
staticCubes = new Kinetic.Layer
  hitGraphEnabled: false
staticBg = new Kinetic.Layer
  hitGraphEnabled: false
hudLayer = new Kinetic.FastLayer
  hitGraphEnabled: false
tmpLayer = new Kinetic.FastLayer
  hitGraphEnabled: false

stage.add staticBg
stage.add players
stage.add staticCubes
stage.add dynamicEntities
stage.add hudLayer
stage.add tmpLayer

networkManager = new NetworkManager()
contentLoader = new ContentLoader()
collisionManager = new CollisionManager()
keyboard = new Keyboard()
levelManager = new LevelManager()
bonusManager = new BonusManager()
bossManager = new BossManager()
cubeManager = new CubeManager()
skinManager = new SkinManager()
saveManager  = new SaveManager()

game = new Game()
game.loadAssets()

arena = null
player = null
hud = null
skin = { body: 1, hair: 1, head: 1, leg: 1, shoes: 1, skin: 1, hat: 1, beard: 1 }

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
            y: levelManager.ground - y * 32 - 32
            width: 32
            height: 32
            stroke: "red"
          debugLayer.add shape
    debugLayer.draw()

contentLoader.contentsLoaded = ->
  document.querySelector('#login-form').style.display = 'block'
  document.querySelector('#login-loading').style.display = 'none'

  saveManager.loadOptions()

  contentLoader.playSong()

  launchGame = (name) ->
    bg = new Kinetic.Image
      width: stage.getWidth()
      height: stage.getHeight()
      image: contentLoader.images['bg']
    staticBg.add bg
    bg.setZIndex(-1)
    bg.draw()

    arena = new Arena()
    player = new ControllablePlayer(skin)
    hud = new HUD()

    networkManager.connect(config.host, name, skin)

    pidgeon = new Pidgeon()

    game.update = (frameTime) ->
      game.draw()
      player.update(frameTime)
      bossManager.update(frameTime)
      hud.update(frameTime)
      cubeManager.update(frameTime)
      pidgeon.update(frameTime)

    game.draw = ->
      players.drawScene()
      dynamicEntities.drawScene()

  document.querySelector('#play').onclick = ->
    name = document.querySelector('#name').value
    if name
      document.querySelector('#login-form').style.display = 'none'
      document.querySelector('#login-loading').style.display = 'block'
      document.querySelector('#login-loading').innerHTML = 'Connecting...'
      launchGame(name)
      contentLoader.play('beep')
      saveManager.saveOptions()
    else
      alert 'Name required'
