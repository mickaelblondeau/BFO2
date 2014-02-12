SquareEnum = {
  SMALL : { x: 32, y: 32 }
  MEDIUM : { x: 64, y: 64 }
  LARGE : { x: 128, y: 128 }
  MEDIUM_RECT : { x: 64, y: 32 }
  LARGE_RECT : { x: 128, y: 64 }
  LONG_RECT : { x: 32, y: 128 }
}

SpecialCubes = [
  'iceExplosion',
  'explosion',
  'slowblock',
  'swapblock',
  'tpblock'
]

class CubeManager
  constructor: ->
    @map = []
    @cubeMap = []
    @resetMap()
    @updateRate = 0
    @current = 0
    @levelHeight = 0
    @running = false
    @waiting = false
    @bonusId = 0

    @types = [
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'iceExplosion'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'explosion'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'slowblock'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'stompblock'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'swapblock'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'tpblock'
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'randblock'
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'speed'
        bonusId: 1
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'jumpHeight'
        bonusId: 2
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'doubleJump'
        bonusId: 3
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'grabbing'
        bonusId: 4
      },
      {
        proba: 5
        size: SquareEnum.LARGE
        width: SquareEnum.LARGE.x/32
        height: SquareEnum.LARGE.y/32
      },
      {
        proba: 20
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
      },
      {
        proba: 15
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
      },
      {
        proba: 10
        size: SquareEnum.MEDIUM_RECT
        width: SquareEnum.MEDIUM_RECT.x/32
        height: SquareEnum.MEDIUM_RECT.y/32
      },
      {
        proba: 5
        size: SquareEnum.LARGE_RECT
        width: SquareEnum.LARGE_RECT.x/32
        height: SquareEnum.LARGE_RECT.y/32
      },
      {
        proba: 5
        size: SquareEnum.LONG_RECT
        width: SquareEnum.LONG_RECT.x/32
        height: SquareEnum.LONG_RECT.y/32
      }
    ]

  start: (level, rate) ->
    if !@running and !@waiting
      if levelManager.level != 0
        networkManager.sendBonus(4, 5, @map[4], @bonusId)
        @bonusId++
      @updateRate = rate
      @current = 0
      @levelHeight = level
      @running = true

      if config.debugMap
        @debug()

  reset: ->
    @levelHeight = 0
    @stop()
    @waiting = false
    @bonusId = 0
    @resetMap()

  stop: ->
    @running = false

  wait: ->
    @stop()
    @waiting = true
    levelManager.update()
    @fillMap()

  resetMap: ->
    for i in [0..11]
      @map[i] = 0

    for i in [0..11]
      @cubeMap[i] = []

  sendCube: ->
    choices = @checkCols()
    if choices.length > 0
      tmp = @randomizeType(choices)
      type = tmp.type
      typeIndex = tmp.index
      count = choices[typeIndex].length
      rand = Math.floor(Math.random()*count)
      choice = choices[typeIndex][rand]
      if type.bonus isnt undefined
        networkManager.sendBonus(choice.column, type.bonusId, @bonusId)
        @bonusId++
      else if type.special isnt undefined
        if type.special is 'explosion'
          @explodeMap(choice.column, choice.height)
        else if type.special is 'randblock'
          randType = SpecialCubes[Math.floor((Math.random()*SpecialCubes.length))]
          if randType is 'explosion'
            @explodeMap(choice.column, choice.height)
          networkManager.sendRanSpecial(choice.column, type.size, randType)
        else
          networkManager.sendSpecial(choice.column, type.size, type.special)
      else
        networkManager.sendCube(choice.column, type.size)
        for columnPosition in [1..type.width]
          @map[choice.column + columnPosition - 1] = choice.height + type.height
          for h in [0..type.height-1]
            @cubeMap[choice.column + columnPosition - 1][choice.height + h] = 1
      if config.debug
        networkManager.sendMap(@cubeMap)
      return true
    else
      return false

  randomizeType: (choices) ->
    possibleTypes = []
    for type, typeIndex in @types
      if choices[typeIndex] isnt undefined and choices[typeIndex].length > 0
        possibleTypes.push { type: type, index: typeIndex, proba: type.proba }
    if possibleTypes.length != @types.length
      ratio = @types.length / possibleTypes.length
      for possibleType in possibleTypes
        possibleType.proba *= ratio
    randomMap = []
    randomCount = 0
    for possibleType, index in possibleTypes
      randomCount += possibleType.proba
      randomMap.push { index: index, percent: randomCount }
    rand = Math.floor(Math.random()*randomCount)+1
    for item in randomMap
      if rand <= item.percent
        return possibleTypes[item.index]
    return possibleTypes[randomMap.length - 1]

  update: (frameTime) ->
    if @running
      @current += frameTime
      if @current >= @updateRate
        @current = 0
        if !config.debugMap
          if !@sendCube()
            @wait()

  checkCols: ->
    available = []
    for column, columnIndex in @map
      for type, typeIndex in @types
        placeForType = true
        height = 0
        for columnPosition in [1..type.width]
          tmp = @map[columnIndex + columnPosition - 1]
          if !(tmp + type.height <= @levelHeight)
            placeForType = false
            break
          else if tmp > height
            height = tmp
        if placeForType
          if available[typeIndex] is undefined
            available[typeIndex] = []
          available[typeIndex].push {
            column: columnIndex
            height: height
          }
    return available

  explodeMap: (col, height) ->
    for i in [-4..5]
      if i > 0
        j = i-1
      else
        j = i
      newCol = col + i

      if newCol >= 0 && newCol <= 11
        deep = (-5 + Math.abs(j))
        colHeight = 0
        if @cubeMap[newCol] isnt undefined and @cubeMap[newCol] isnt null
          colHeight = @cubeMap[newCol].length
        newColHeight = (height + deep + 1)
        newColMaxHeight = (height - deep + 1)

        if @cubeMap[newCol] isnt undefined and @cubeMap[newCol] isnt null
          for val, k in @cubeMap[newCol]
            if k > newColHeight and k < newColMaxHeight
              @cubeMap[newCol][k] = null

    @syncMap()

  syncMap: ->
    for subMap, i in @cubeMap

      @cubeMap[i] = @cubeMap[i].filter(
        (e)->
          e
      )

      tmp = @cubeMap[i].lastIndexOf(1)
      if tmp is -1
        @cubeMap[i] = []
      else
        @cubeMap[i] = @cubeMap[i].slice(0, tmp+1)

      len = 0
      if @cubeMap[i] isnt undefined and @cubeMap[i] isnt null
        len = @cubeMap[i].length
      @map[i] = len

  fillMap: ->
    for i in [0..11]
      @map[i] = 0
      @cubeMap[i] = []

  debug: ->
    self = @

    fn = ->
      i = 0
      j = 0
      networkManager.sendCube(i, SquareEnum.MEDIUM)
      self.cubeMap[i][j] = 1
      self.cubeMap[i+1][j] = 1
      self.cubeMap[i][j+1] = 1
      self.cubeMap[i+1][j+1] = 1
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 200)

    fn = ->
      i = 1
      j = 2
      networkManager.sendCube(i, SquareEnum.MEDIUM)
      self.cubeMap[i][j] = 1
      self.cubeMap[i+1][j] = 1
      self.cubeMap[i][j+1] = 1
      self.cubeMap[i+1][j+1] = 1
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 400)

    fn = ->
      i = 0
      j = 4
      networkManager.sendCube(i, SquareEnum.MEDIUM)
      self.cubeMap[i][j] = 1
      self.cubeMap[i+1][j] = 1
      self.cubeMap[i][j+1] = 1
      self.cubeMap[i+1][j+1] = 1
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 600)

    fn = ->
      i = 2
      j = 4
      networkManager.sendCube(i, SquareEnum.MEDIUM)
      self.cubeMap[i][j] = 1
      self.cubeMap[i+1][j] = 1
      self.cubeMap[i][j+1] = 1
      self.cubeMap[i+1][j+1] = 1
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 600)

    fn = ->
      col = 5
      row = 0

      networkManager.sendSpecial(col, SquareEnum.MEDIUM, 'explosion')
      self.explodeMap(col, row)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 3000)