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

player = new ControllablePlayer(500, 256)

cubeManager = new CubeManager()
levelManager = new LevelManager()

new FallingCube(0, SquareEnum.MEDIUM, 1)
new FallingCube(3, SquareEnum.SMALL, 0)
new FallingCube(5, SquareEnum.MEDIUM, 2)
new FallingCube(7, SquareEnum.SMALL, 0)
new FallingCube(7, SquareEnum.SMALL, 1)

game.update = (frameTime) ->
  players.draw()
  player.update(frameTime)
  cubeManager.update(frameTime)

  cubes = fallingCubes.find('Rect')
  HTML.query('#cc').textContent = cubes.length