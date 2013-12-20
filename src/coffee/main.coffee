stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

fallingCubes = new Kinetic.Layer()
players = new Kinetic.Layer()
staticLayer = new Kinetic.Layer()
stage.add staticLayer
stage.add players
stage.add fallingCubes

staticCubes = new Kinetic.Group()
staticLayer.add staticCubes

bg = new Kinetic.Rect
  width: stage.getWidth()
  height: stage.getHeight()
  fill: "grey"
  stroke: "black"
staticLayer.add bg
bg.setZIndex(-1)
bg.draw()

game = new Game()
game.start()
collisionManager = new CollisionManager()
arena = new Arena()
keyboard = new Keyboard()
player = new ControllablePlayer()
cubeManager = new CubeManager()
levelManager = new LevelManager()

game.update = (frameTime) ->
  players.draw()
  player.update(frameTime)
  cubeManager.update(frameTime)

  cubes = fallingCubes.find('Rect')
  HTML.query('#cc').textContent = cubes.length