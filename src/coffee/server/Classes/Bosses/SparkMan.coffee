class SparkMan extends Boss
  constructor: ->
    super('sparkman', 30000, @getPattern())
    @id = 5

  getPattern: ->
    speed = Math.round((0.5 + 0.03 * (levelManager.level + config.bossDifficulty)) * 100) / 100
    attackSpeed = Math.round((0.2 + 0.005 * ((levelManager.level + config.bossDifficulty) - 1)) * 100) / 100
    interval = 4000 - 20 * (levelManager.level + config.bossDifficulty)
    options = [speed, attackSpeed, interval]
    attacks = @makeLevel(attackSpeed)
    return [options, attacks]

  makeLevel: (xSpeed) ->
    attacks = []
    for i in [0..7]
      ySpeed = (Math.round(Math.random()*(xSpeed*100-10)+10))/100
      xSide = Math.round(Math.random()*2-1)
      ySide = 1
      if xSide is 0
        xSide = 1
      attacks.push([xSide, ySide, ySpeed])
    return attacks