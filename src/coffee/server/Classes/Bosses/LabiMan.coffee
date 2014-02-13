class LabiMan extends Boss
  constructor: ->
    super('labiman', 15000, @getPattern())
    @id = 4

  getPattern: ->
    speed = Math.round((0.3 + 0.05 * levelManager.level) * 100) / 100
    attackSpeed = Math.round((0.08 + 0.015 * (levelManager.level - 1)) * 100) / 100
    options = [speed, attackSpeed]
    attacks = @makeLevel()
    return [options, attacks]

  makeLevel: ->
    level = []
    level.push([Math.floor(Math.random()*10), 2])
    for i in [0..10]
      level.push(@nextPossibility(level))
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