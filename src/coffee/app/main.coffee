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

contentLoader.contentsLoaded = ->
  document.querySelector('#login-form').style.display = 'block'
  document.querySelector('#login-loading').style.display = 'none'

  contentLoader.sounds['music'].loop = true
  contentLoader.sounds['music'].play()

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
    game.start()

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

      fn = ->
        bossManager.spawn('freezeman', [[1, 1200], [[0, 10], [0, 10]]])
      setTimeout(fn, 1000)

  document.querySelector('#play').onclick = () ->
    document.querySelector('#login').style.display = 'none'
    launchGame(document.querySelector('#ip').value.replace(" ",""), document.querySelector('#name').value)
    contentLoader.play('beep')