class SparkManPart extends Boss
  constructor: (x, y, attack) ->
    super('roueman', x, y, 64, 64)
    @sideX = attack[0]
    @sideY = attack[1]
    @ySpeed = attack[2]
    @life = 10

  changeSide: (side) ->
    if side is 'x'
      @sideX *= -1
    else
      @sideY *= -1
    @life--
    if @life is 0
      @reset()
      return true
    else
      return false