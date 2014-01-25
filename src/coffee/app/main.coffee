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
stage.add staticCubes
stage.add players
stage.add dynamicEntities
stage.add hudLayer

networkManager = new NetworkManager()
imageLoader = new ImageLoader()
collisionManager = new CollisionManager()
keyboard = new Keyboard()
levelManager = new LevelManager()
bonusManager = new BonusManager()
bossManager = new BossManager()

game = new Game()
game.loadAssets()

arena = null
player = null
hud = null

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

imageLoader.imagesLoaded = ->
  launchGame = (ip, name) ->
    bg = new Kinetic.Rect
      width: stage.getWidth()
      height: stage.getHeight()
      fillPatternImage: imageLoader.images['bg']
    staticBg.add bg
    bg.setZIndex(-1)
    bg.draw()

    arena = new Arena()
    player = new ControllablePlayer()
    hud = new HUD()

    networkManager.connect(ip, name)

    game.update = (frameTime) ->
      players.draw()
      player.update(frameTime)
      bossManager.update(frameTime)
      hud.update(frameTime)
    game.start()

  document.getElementById('play').onclick = () ->
    document.getElementById('login').style.display = 'none'
    launchGame(document.getElementById('ip').value, document.getElementById('name').value)