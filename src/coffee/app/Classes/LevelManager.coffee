class LevelManager
  constructor: ->
    @tweens = []
    @level = 0

  reset: ->
    for tween in @tweens
      if tween isnt undefined
        tween.destroy()
    stage.setY(0)
    staticBg.setY(0)
    arena.reset()
    bonusManager.reset()
    bossManager.reset()
    hud.reset()
    dynamicEntities.destroyChildren()
    stage.draw()
    @level = 0

  moveLevel: (height) ->
    arena.add(height/32)
    @tweens[0] = new Kinetic.Tween
      node: stage
      duration: 2
      y: stage.getY() + height * game.scale
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
    HTML.query('#lml').textContent = @level
    arena.clearOutOfScreen()
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getY() > stage.getY()*-1 + stage.getHeight()
        cube.destroy()
    if player.shape.getY() > stage.getY()*-1 + stage.getHeight()
      player.kill()