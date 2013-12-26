class BossManager
  constructor: ->
    @launched = false

  launch: ->
    networkManager.sendBoss('roueman', [3, 1, 1, 3, 3], 15000)
    @launched = true

  reset: ->
    @launched = false