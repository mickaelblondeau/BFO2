class BossManager
  constructor: ->
    @currentBoss

  spawn: (boss, options) ->
    if boss == 'roueman'
      @currentBoss = new RoueMan(0, options)

  reset: ->
    @currentBoss.reset()