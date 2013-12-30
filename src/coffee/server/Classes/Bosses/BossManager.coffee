class BossManager
  constructor: ->
    @launched = false
    @boss = ['roueman', 'freezeman']

  launch: ->
    boss = @getBoss()
    networkManager.sendBoss(boss.name, boss.options, boss.timeout)
    @launched = true

  reset: ->
    @launched = false

  getBoss: ->
    boss = @boss[Math.floor(Math.random()*@boss.length)]
    if boss is 'roueman'
      return new RoueMan()
    else if boss is 'freezeman'
      return new FreezeMan()