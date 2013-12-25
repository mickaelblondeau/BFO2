class BossManager
  constructor: ->
    @currentBoss

  spawn: (boss, options) ->
    if boss == 'roueman'
      @currentBoss = new RoueMan(0, options)

  reset: ->
    if @currentBoss isnt undefined
      @currentBoss.reset()