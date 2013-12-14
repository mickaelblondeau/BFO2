stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

fallingCubes = new Kinetic.Layer()
staticCubes = new Kinetic.Layer()
players = new Kinetic.Layer()
staticBg = new Kinetic.Layer()

stage.add staticBg
stage.add players
stage.add staticCubes
stage.add fallingCubes

bg = new Kinetic.Rect
  width: stage.getWidth()
  height: stage.getHeight()
  fill: "grey"
  stroke: "black"
staticBg.add bg
bg.draw()

game = new Game()
game.start()

collisionManager = new CollisionManager()

arena = new Arena()

keyboard = new Keyboard()

player = new ControllablePlayer(200, 256)

cubeManager = new CubeManager()
levelManager = new LevelManager()

game.update = (frameTime) ->
  players.draw()
  player.update(frameTime)
  cubeManager.update(frameTime)