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
  'stompblock',
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
    @cubes = []

    @types = [
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'iceExplosion'
        id: 0
      },
      {
        proba: 5
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'explosion'
        id: 1
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'slowblock'
        id: 2
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'stompblock'
        id: 3
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'swapblock'
        id: 4
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'tpblock'
        id: 5
      },
      {
        proba: 2
        size: SquareEnum.MEDIUM
        width: SquareEnum.MEDIUM.x/32
        height: SquareEnum.MEDIUM.y/32
        special: 'randblock'
        id: 6
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'speed'
        id: 1
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'jumpHeight'
        id: 2
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'doubleJump'
        id: 3
      },
      {
        proba: 2
        size: SquareEnum.SMALL
        width: SquareEnum.SMALL.x/32
        height: SquareEnum.SMALL.y/32
        bonus: 'grabbing'
        id: 4
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
      @resetCubes()
      @running = true

  reset: ->
    @levelHeight = 0
    @stop()
    @waiting = false
    @bonusId = 0
    @resetCubes()
    @resetMap()

  resetCubes: ->
    @cubes = []

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
        new Bonus(choice.column, choice.height, type)
      else if type.special isnt undefined
        new Special(choice.column, choice.height, type)
      else
        new Block(choice.column, choice.height, type, true)
      networkManager.sendMap(@cubeMap)
      return true
    else
      return false

  addCubeToMap: (col, line, type) ->
    for columnPosition in [1..type.width]
      @map[col + columnPosition - 1] = line + type.height
      for h in [0..type.height-1]
        @cubeMap[col + columnPosition - 1][line + h] = 1

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

    biggest = { width: 0, height: 0 }
    for possibleType, index in possibleTypes
      if possibleType.type.width > biggest.width or possibleType.type.height > biggest.height
        biggest.width = possibleType.type.width
        biggest.height = possibleType.type.height
      randomCount += possibleType.proba
      randomMap.push { index: index, percent: randomCount, type: possibleType.type }
    rand = Math.floor(Math.random()*randomCount)+1

    if biggest.width is 1 and biggest.height is 1
      @updateRate = config.fastLevelSpeed

    for item in randomMap
      if !(biggest.width is 1 and biggest.height is 1 and item.type.bonus isnt undefined)
        if rand <= item.percent
          return possibleTypes[item.index]
    return possibleTypes[randomMap.length - 1]

  update: (frameTime) ->
    if @running
      @current += frameTime
      if @current >= @updateRate
        @current = 0
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

  explodeMap: (col, line) ->
    map = @createExplosionMap(col, line)
    for cube, i in @cubes
      if cube isnt null
        for pos in map
          if cube.intersect(pos[0], pos[1])
            @cubes[i] = null
    @cubes = @cubes.filter (val) ->
      val isnt null
    @applyGravity()

  createExplosionMap: (col, line) ->
    map = []
    for i in [-1..2]
      for j in [-1..2]
        map.push([col + i, line + j])
    return map

  applyGravity: ->
    @rebuildMap()
    for cube in @cubes
      if cube isnt null
        canFall = true
        while(canFall)
          for i in [0..cube.type.width-1]
            if @cubeMap[cube.col + i][cube.line - 1] == 1
              canFall = false
              break
          if canFall
            if cube.line == 0
              canFall = false
            else
              cube.line -= 1
    @rebuildMap()

  rebuildMap: ->
    @resetMap()
    for cube in @cubes
      if cube isnt null
        for columnPosition in [1..cube.type.width]
          @map[cube.col + columnPosition - 1] = cube.line + cube.type.height
          for h in [0..cube.type.height-1]
            @cubeMap[cube.col + columnPosition - 1][cube.line + h] = 1

  fillMap: ->
    for i in [0..11]
      @map[i] = 0
      @cubeMap[i] = []

  debug: ->
    b1 = {
      proba: 20
      size: SquareEnum.MEDIUM
      width: SquareEnum.MEDIUM.x/32
      height: SquareEnum.MEDIUM.y/32
    }
    b2 = {
      proba: 5
      size: SquareEnum.LARGE
      width: SquareEnum.LARGE.x/32
      height: SquareEnum.LARGE.y/32
    }
    b3 = {
      proba: 5
      size: SquareEnum.MEDIUM
      width: SquareEnum.MEDIUM.x/32
      height: SquareEnum.MEDIUM.y/32
      special: 'explosion'
      id: 1
    }
    new Block(0, 0, b1, true)
    new Block(2, 0, b1, true)
    new Block(4, 0, b1, true)
    networkManager.sendMap(@cubeMap)

    self = @

    fn = ->
      new Block(2, 2, b2, true)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 500)

    fn = ->
      new Block(4, 6, b1, true)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 750)

    fn = ->
      new Special(0, 2, b3)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, 1000)