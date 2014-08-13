class LabiMan extends Boss
  constructor: ->
    super('labiman', 15000, @getPattern())
    @id = 4

  getPattern: ->
    speed = 0.4
    level = @getLevel(6, 3)
    attackSpeed = Math.round((0.075 + 0.0075 * ((level + config.bossDifficulty) - 1)) * 100) / 100
    wait = 4000 - 50 * (levelManager.level + config.bossDifficulty)
    options = [speed, attackSpeed, wait]
    attacks = @makeLevel()
    return [options, attacks]

  makeLevel: ->
    level = []
    level.push([Math.floor(Math.random()*10), 2])
    for i in [0..10]
      tmp = @nextPossibility(level)
      if tmp[1] < 20
        level.push(tmp)
    return level

  nextPossibility: (level) ->
    lastLevel = level[level.length - 1]
    postLastLevel = level[level.length - 2]

    possibilities = []

    if level.length is 1
      possibilities = [[2, 2], [-2, 2]]
    else
      if lastLevel[1] is postLastLevel[1] + 1
        if lastLevel[0] >= postLastLevel[0]
          possibilities.push([1, 2], [2, 2], [-2, 2])
        else
          possibilities.push([-1, 2], [-2, 2], [2, 2])
      else
        if lastLevel[0] >= postLastLevel[0]
          possibilities.push([1, 2], [2, 2], [-2, 2])
        else
          possibilities.push([-1, 2], [-2, 2], [2, 2])

    loop
      nextIndex = Math.floor(Math.random()*possibilities.length)
      next = [lastLevel[0] + possibilities[nextIndex][0], lastLevel[1] + possibilities[nextIndex][1]]
      break if next[0] >= 0 and next[0] <= 10

    return next