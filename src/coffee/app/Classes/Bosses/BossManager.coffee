class BossManager
  constructor: ->
    @currentBoss

  spawn: (boss, options) ->
    if boss == 1
      @currentBoss = new RoueMan(options)
    if boss == 2
      @currentBoss = new FreezeMan(options)
    if boss == 3
      @currentBoss = new PoingMan(options)

  reset: ->
    @stopUpdate()
    if @currentBoss isnt undefined
      @currentBoss.reset()

  update: (frameTime) ->

  stopUpdate: ->
    @update = (frameTime) ->