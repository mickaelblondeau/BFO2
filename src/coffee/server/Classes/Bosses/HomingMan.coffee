class HomingMan extends Boss
  constructor: ->
    super('homingman', 20000, @getPattern())
    @id = 6

  getPattern: ->
    speed = 0.5
    attackSpeed = Math.round((0.4 + 0.01 * (levelManager.level - 1)) * 100) / 100
    options = [speed, attackSpeed]
    attacks = @getLevel()
    return [options, attacks]

  getLevel: ->
    wait = 500
    secondWait = 2000
    attacks = []
    patterns = [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
      [1, 0, 0]
    ]
    randPat = []
    for i in [1..4]
      randPat.push(Math.floor(Math.random()*(patterns.length - 1)))
    for i in [1..3]
      tmp = [[0, i]]
      for j in [1..4]
        if j % 2 is 0
          tmp.push([0, wait + patterns[randPat[j-1]][i-1] * secondWait])
        else
          tmp.push([1, wait + patterns[randPat[j-1]][i-1] * secondWait])
      attacks.push(tmp)
    for i in [1..3]
      tmp = [[1, i]]
      for j in [1..4]
        if j % 2 is 0
          tmp.push([1, secondWait + patterns[randPat[j-1]][i-1] * secondWait])
        else
          tmp.push([0, secondWait + patterns[randPat[j-1]][i-1] * secondWait])
      attacks.push(tmp)
    return attacks