stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

dynamicEntities = new Kinetic.Layer()
players = new Kinetic.Layer()
staticCubes = new Kinetic.Layer()
staticBg = new Kinetic.Layer()

stage.add staticBg
stage.add staticCubes
stage.add players
stage.add dynamicEntities

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

imageLoader.imagesLoaded = ->
  bg = new Kinetic.Rect
    width: stage.getWidth()
    height: stage.getHeight()
    fillPatternImage: imageLoader.images['bg']
  staticBg.add bg
  bg.setZIndex(-1)
  bg.draw()

  arena = new Arena()
  player = new ControllablePlayer()

  game.update = (frameTime) ->
    players.draw()
    player.update(frameTime)

    cubes = dynamicEntities.find('Sprite')
    HTML.query('#cc').textContent = cubes.length

    cubes = staticCubes.find('Sprite')
    HTML.query('#sc').textContent = cubes.length

  game.start()