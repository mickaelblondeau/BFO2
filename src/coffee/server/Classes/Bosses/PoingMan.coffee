class PoingMan extends Boss
  constructor: ->
    super('poingman', 15000, @getPattern())
    @id = 3

  getPattern: ->
    level = @getLevel(6, 2)
    speed = Math.round((0.4 + 0.035 * (level + config.bossDifficulty)) * 100) / 100
    attackSpeed = Math.round((0.6 + 0.04 * (level + config.bossDifficulty)) * 100) / 100
    waitTime = 600 - 15 * (level + config.bossDifficulty)
    options = [speed, attackSpeed, waitTime]
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*12)-1)
      if attack is -1
        attack = 0
      else if attack is 11
        attack = 10
      attacks.push attack
    return [options, attacks]