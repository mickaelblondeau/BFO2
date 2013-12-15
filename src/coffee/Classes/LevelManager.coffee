class LevelManager
  constructor: ->
    @level = 0
    @speed = 1000
    @tween = []
    @lastHeight = 0

  launch: ->
    @nextLevel()

  reset: ->
    if @tween[0] isnt undefined
      @tween[0].pause()
    if @tween[1] isnt undefined
      @tween[1].pause()
    stage.setY(0)
    staticBg.setY(0)
    fallingCubes.destroyChildren()
    stage.draw()
    cubeManager.reset()
    @level = 0
    @speed = 1000

  moveStage: ->
    self = @
    height = @lastHeight * 32
    @tween[0] = new Kinetic.Tween
      node: stage
      duration: 2
      y: stage.getY() + height
      onFinish: ->
        cubeManager.waiting = false
        self.nextLevel()
    @tween[0].play()
    @tween[1] = new Kinetic.Tween
      node: staticBg
      duration: 2
      y: staticBg.getY() - height
    @tween[1].play()

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
    height = @lastHeight * 32
    cubes = fallingCubes.find('Rect')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight()
        cube.destroy()