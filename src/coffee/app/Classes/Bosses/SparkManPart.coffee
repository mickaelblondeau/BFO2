class SparkManPart extends Boss
  constructor: (x, y, attack) ->
    super('spark', x, y, 32, 32)
    @sideX = attack[0]
    @sideY = attack[1]
    @ySpeed = attack[2]
    @life = 0
    @alive = true

  reset: ->
    super()
    bossManager.currentBoss.attackFinished++
    @alive = false