class BossManager
  constructor: ->
    @currentBoss

  spawn: (boss, options) ->
    if boss == 'roueman'
      @currentBoss = new RoueMan(options)
    if boss == 'freezeman'
      @currentBoss = new FreezeMan(options)
    if boss == 'poingman'
      @currentBoss = new PoingMan(options)

  reset: ->
    @stopUpdate()
    if @currentBoss isnt undefined
      @currentBoss.reset()

  update: (frameTime) ->

  stopUpdate: ->
    @update = (frameTime) ->
