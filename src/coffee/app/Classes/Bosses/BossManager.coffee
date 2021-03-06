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
    if boss == 4
      @currentBoss = new LabiMan(options)
    if boss == 5
      @currentBoss = new SparkMan(options)
    if boss == 6
      @currentBoss = new HomingMan(options)
    if boss == 7
      @currentBoss = new MissileMan(options)

  reset: ->
    @stopUpdate()
    if @currentBoss isnt undefined
      @currentBoss.reset()

  update: (frameTime) ->

  stopUpdate: ->
    @update = (frameTime) ->