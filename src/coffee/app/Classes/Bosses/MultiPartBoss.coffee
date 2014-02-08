class MultiPartBoss extends Boss
  constructor: (type, x, y, w, h) ->
    super(type, x, y, w, h)
    @parts = []

  reset: ->
    super()
    for part in @parts
      part.reset()

  finish: ->
    @reset()
    bossManager.stopUpdate()
    networkManager.sendBossBeaten()