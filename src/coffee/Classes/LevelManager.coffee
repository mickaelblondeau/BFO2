class LevelManager
  constructor: ->
    @tweens = []

  reset: ->
    for tween in @tweens
      if tween isnt undefined
        tween.pause()
    stage.setY(0)
    staticBg.setY(0)
    arena.reset()
    fallingCubes.destroyChildren()
    stage.draw()

  moveLevel: (height) ->
    arena.add(height/32)
    @tweens[0] = new Kinetic.Tween
      node: stage
      duration: 2
      y: stage.getY() + height
    @tweens[0].play()
    @tweens[1] = new Kinetic.Tween
      node: staticBg
      duration: 2
      y: staticBg.getY() - height
    @tweens[1].play()

  clearLevel: ->
    arena.clearOutOfScreen()
    cubes = fallingCubes.find('Rect')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight()
        cube.destroy()