class BossManager
  constructor: ->
    @currentBoss

  spawn: (boss, options) ->
    if boss == 'roueman'
      @currentBoss = new RoueMan(0, options)
    if boss == 'freezeman'
      @currentBoss = new FreezeMan(0, options)

  reset: ->
    @stopUpdate()
    if @currentBoss isnt undefined
      @currentBoss.reset()

  update: (frameTime) ->

  stopUpdate: ->
    @update = (frameTime) ->
