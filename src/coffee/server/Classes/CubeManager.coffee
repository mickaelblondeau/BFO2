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
    @types = []
    @initTypes()

  initTypes: ->
    @addBlock(5, SquareEnum.LARGE)
    @addBlock(20, SquareEnum.MEDIUM)
    @addBlock(15, SquareEnum.SMALL)
    @addBlock(10, SquareEnum.MEDIUM_RECT)
    @addBlock(5, SquareEnum.LARGE_RECT)
    @addBlock(5, SquareEnum.LONG_RECT)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'iceExplosion', 0)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'slowblock', 1)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'stompblock', 2)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'swapblock', 3)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'tpblock', 4)
    @addSpecialBlock(1, SquareEnum.MEDIUM, 'randblock', 5)
    @addBonus(2, SquareEnum.SMALL, 'speed', 1)
    @addBonus(2, SquareEnum.SMALL, 'jumpHeight', 2)
    @addBonus(2, SquareEnum.SMALL, 'doubleJump', 3)
    @addBonus(2, SquareEnum.SMALL, 'grabbing', 4)
    @addBonus(2, SquareEnum.SMALL, 'autoRezBonus', 6)
    @addBonus(2, SquareEnum.SMALL, 'tpBonus', 7)
    @addBonus(2, SquareEnum.SMALL, 'jumpBlockBonus', 8)

  addBlock: (proba, size) ->
    obj = {
      proba: proba
      size: size
      width: size.x/32
      height: size.y/32
    }
    @types.push(obj)

  addSpecialBlock: (proba, size, name, id) ->
    obj = {
      proba: proba
      size: size
      width: size.x/32
      height: size.y/32
      special: name
      id: id
    }
    @types.push(obj)

  addBonus: (proba, size, name, id) ->
    obj = {
      proba: proba
      size: size
      width: size.x/32
      height: size.y/32
      bonus: name
      id: id
    }
    @types.push(obj)

  start: (level, rate) ->
    if !@running and !@waiting
      if levelManager.level != 0
        networkManager.sendBonus(4, 5, @map[4], @bonusId)
        @bonusId++
      @updateRate = rate
      @current = 0
      @levelHeight = level
      @resetCubes()
      if config.debug
        @debug()
      else
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
    new Block(0, 0, b2, true)
    networkManager.sendMap(@cubeMap)

    self = @

    interval = config.levelSpeed

    fn = ->
      new Block(1, 4, b1, true)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, interval*1)

    fn = ->
      new Block(2, 6, b1, true)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, interval*2)

    fn = ->
      new Block(0, 8, b2, true)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, interval*3)

    fn = ->
      new Special(4, 0, b3)
      networkManager.sendMap(self.cubeMap)
    setTimeout(fn, interval*4)