class BossManager
  constructor: ->
    @currentBoss
    @tweens = []

  spawn: (boss, options) ->
    if boss == 'roueman'
      @currentBoss = new RoueMan(0, options)
    if boss == 'freezeman'
      @currentBoss = new FreezeMan(0, options)

  reset: ->
    for tween in @tweens
      tween.destroy()
    @tweens = []
    if @currentBoss isnt undefined
      @currentBoss.reset()