class LevelManager
  constructor: ->
    @tweens = []
    @level = 0
    @levelHeight = 0
    @ground = 0

  reset: ->
    for tween in @tweens
      if tween isnt undefined
        tween.destroy()
    for tween in cubeManager.tweens
      if tween isnt undefined
        tween.destroy()
    stage.setY(0)
    staticBg.setY(0)
    hudLayer.setY(0)
    arena.reset()
    bossManager.reset()
    dynamicEntities.destroyChildren()
    stage.draw()
    @level = 0
    @levelHeight = 0
    @ground = 0

  moveLevel: (height) ->
    arena.add(height/32)
    @levelHeight += height
    @ground = arena.y - @levelHeight
    @tweens[0] = new Kinetic.Tween
      node: stage
      duration: 2
      y: stage.getY() + height
      onFinish: ->
        networkManager.sendMoveLevelOk()
    @tweens[0].play()
    @tweens[1] = new Kinetic.Tween
      node: staticBg
      duration: 2
      y: staticBg.getY() - height
    @tweens[1].play()
    @tweens[2] = new Kinetic.Tween
      node: hudLayer
      duration: 2
      y: hudLayer.getY() - height
    @tweens[2].play()

  clearLevel: ->
    @level++
    bossManager.reset()
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight() or cube.getName().type isnt 'cube'
        cube.destroy()
    if player.shape.getY() > stage.getY()*-1 + stage.getHeight()
      player.kill()
    arena.clearOutOfScreen()
    cubeManager.convertToStatic()