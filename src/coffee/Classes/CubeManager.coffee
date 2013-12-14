class CubeManager
  constructor: ->
    @map = []
    @resetMap()
    @updateRate = 0
    @current = 0
    @levelHeight = 0
    @running = false
    @waiting = false

  start: (level, rate) ->
    if !@running and !@waiting
      @updateRate = rate
      @current = 0
      @levelHeight += level
      @running = true
      HTML.query('#cmr').textContent = true
      HTML.query('#cml').textContent = level
      HTML.query('#cms').textContent = rate

  reset: ->
    @levelHeight = 0
    @stop()
    @waiting = false
    @resetMap()

  stop: ->
    @running = false
    HTML.query('#cmr').textContent = false

  wait: ->
    @stop()
    @waiting = true
    levelManager.update()

  resetMap: ->
    for i in [0..11]
     @map[i] = 0

  sendCube: ->
    cols = @checkCols()
    bigLen = cols.big.length
    midLen = cols.mid.length
    smallLen = cols.small.length

    if smallLen is 0
      return false
    else
      if bigLen is 0
        if midLen is 0
          size = SquareEnum.SMALL
          @updateRate = 500
        else
          size = @randSize(2)
      else
        size = @randSize(3)
      col = @randCol(size, cols)
      new FallingCube(col, size, @findHeight(size, col))
      @fillMap(size, col)
      return true

  randSize: (max) ->
    size = Math.floor(Math.random()*100)
    if max is 2
      size -= 25
    if max is 1
      return SquareEnum.SMALL
    if size > 75
      return SquareEnum.LARGE
    else if size > 40 and size <= 75
      return SquareEnum.MEDIUM
    else
      return SquareEnum.SMALL

  randCol: (size, cols) ->
    if size is SquareEnum.LARGE
      return cols.big[Math.floor(Math.random()*cols.big.length)]
    else if size is SquareEnum.MEDIUM
      return cols.mid[Math.floor(Math.random()*cols.mid.length)]
    else
      return cols.small[Math.floor(Math.random()*cols.small.length)]

  fillMap: (size, col) ->
    heightest = @findHeight(size, col)
    if size is SquareEnum.LARGE
      @map[col] = heightest + 4
      @map[col+1] = heightest + 4
      @map[col+2] = heightest + 4
      @map[col+3] = heightest + 4
    else if size is SquareEnum.MEDIUM
      @map[col] = heightest + 2
      @map[col+1] = heightest + 2
    else
      @map[col] += 1

  findHeight: (size, col) ->
    heightest = 0
    if size is SquareEnum.LARGE
      heightest = @map[col]
      if @map[col+1] > heightest
        heightest = @map[col+1]
      if @map[col+2] > heightest
        heightest = @map[col+2]
      return heightest
    else if size is SquareEnum.MEDIUM
      heightest = @map[col]
      if @map[col+1] > heightest
        heightest = @map[col+1]
      return heightest
    else
      return @map[col]

  update: (frameTime) ->
    if @running
      @current += frameTime
      if @current >= @updateRate
        @current = 0
        if !@sendCube()
          @wait()
    HTML.query('#cmc').textContent = @map

  checkCols: ->
    availableSmall = []
    availableMid = []
    availableBig = []
    for col, i in @map
      space = @levelHeight - col
      if space > 0
        availableSmall.push(i)
      if space > 1 and @levelHeight - @map[i+1] > 1
        availableMid.push(i)
      if space > 3 and @levelHeight - @map[i+1] > 3 and @levelHeight - @map[i+2] > 3 and @levelHeight - @map[i+3] > 3
        availableBig.push(i)
    return { small: availableSmall, mid: availableMid, big: availableBig }