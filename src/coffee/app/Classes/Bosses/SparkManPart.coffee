class SparkManPart extends Boss
  constructor: (x, y, attack) ->
    super('powerSpark', x, y, 32, 32)
    @sideX = attack[0]
    @sideY = attack[1]
    @ySpeed = attack[2]
    @life = 0
    @alive = true

  changeSide: (side) ->
    if side is 'x'
      @sideX *= -1
    else
      @sideY *= -1

  reset: ->
    super()
    bossManager.currentBoss.attackFinished++
    @alive = false