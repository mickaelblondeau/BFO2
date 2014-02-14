class BossManager
  constructor: ->
    @launched = false
    @boss = ['sparkman']

  launch: ->
    boss = @getBoss()
    networkManager.sendBoss(boss.id, boss.options, boss.timeout)
    @launched = true

  reset: ->
    @launched = false

  getBoss: ->
    boss = @boss[Math.floor(Math.random()*@boss.length)]
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