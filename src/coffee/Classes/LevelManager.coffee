class LevelManager
  constructor: ->
    @level = 0
    @speed = config.levelSpeed
    @tweens = []
    @lastHeight = 0

  launch: ->
    @nextLevel()

  reset: ->
    for tween in @tweens
      if tween isnt undefined
        tween.pause()
    stage.setY(0)
    staticBg.setY(0)
    fallingCubes.destroyChildren()
    stage.draw()
    cubeManager.reset()
    @level = 0
    @speed = config.levelSpeed

  moveStage: ->
    self = @
    height = @lastHeight * 32
    @tweens[0] = new Kinetic.Tween
      node: stage
      duration: 2
      y: stage.getY() + height
      onFinish: ->
        cubeManager.waiting = false
        self.nextLevel()
    @tweens[0].play()
    @tweens[1] = new Kinetic.Tween
      node: staticBg
      duration: 2
      y: staticBg.getY() - height
    @tweens[1].play()

  update: ->
    @level++
    @speed -= 50
    @moveStage()

  randomizeHeight: ->
    return Math.floor((Math.random()*3)+4)

  nextLevel: ->
    @clearLevel()
    @lastHeight = @randomizeHeight()
    cubeManager.start(@lastHeight, @speed)
    HTML.query('#lml').textContent = @level

  clearLevel: ->
    cubes = fallingCubes.find('Rect')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight()
        cube.destroy()