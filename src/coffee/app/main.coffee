stage = new Kinetic.Stage
  container: 'container'
  width: config.levelWidth
  height: config.levelHeight

fallingCubes = new Kinetic.Layer()
players = new Kinetic.Layer()
staticCubes = new Kinetic.Layer()
staticBg = new Kinetic.Layer()

stage.add staticBg
stage.add staticCubes
stage.add players
stage.add fallingCubes

bg = new Kinetic.Rect
  width: stage.getWidth()
  height: stage.getHeight()
  fill: "grey"
  stroke: "black"
staticBg.add bg
bg.setZIndex(-1)
bg.draw()

networkManager = new NetworkManager()

game = new Game()
game.start()
collisionManager = new CollisionManager()
arena = new Arena()
keyboard = new Keyboard()
player = new ControllablePlayer()
levelManager = new LevelManager()
bonusManager = new BonusManager()

game.update = (frameTime) ->
  players.draw()
  player.update(frameTime)

  cubes = fallingCubes.find('Rect')
  HTML.query('#cc').textContent = cubes.length

  cubes = staticCubes.find('Rect')
  HTML.query('#sc').textContent = cubes.length