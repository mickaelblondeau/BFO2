class BossManager
  constructor: ->
    @launched = false
    @initBosses = ['roueman', 'freezeman', 'poingman', 'labiman', 'sparkman', 'homingman', 'missileman']
    @boss = @initBosses
    @tmpBeatenBosses = []

  launch: ->
    boss = @getBoss()
    if boss
      networkManager.sendBoss(boss.id, boss.options, boss.timeout)
      @launched = true
      @updateBosses(boss.name)
    else
      @restart()
      @launch()

  reset: ->
    @launched = false
    @resetBosses()

  getBoss: ->
    boss = @boss[Math.floor(Math.random() * @boss.length)]
    console.log(@boss)
    console.log(boss)
    if boss is 'roueman'
      return new RoueMan()
    else if boss is 'freezeman'
      return new FreezeMan()
    else if boss is 'poingman'
      return new PoingMan()
    else if boss is 'labiman'
      return new LabiMan()
    else if boss is 'sparkman'
      return new SparkMan()
    else if boss is 'homingman'
      return new HomingMan()
    else if boss is 'missileman'
      return new MissileMan()
    else
      return false

  updateBosses: (boss) ->
    @tmpBeatenBosses.push(boss)
    index = @boss.indexOf(boss)
    @boss.splice(index, 1)

  resetBosses: ->
    @boss = @boss.concat(@tmpBeatenBosses)
    @tmpBeatenBosses = []

  saveBosses: ->
    @tmpBeatenBosses = []

  restart: ->
    @tmpBeatenBosses = []
    @boss = @initBosses
