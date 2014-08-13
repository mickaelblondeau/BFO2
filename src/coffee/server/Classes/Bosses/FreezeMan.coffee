class FreezeMan extends Boss
  constructor: ->
    super('freezeman', 15000, @getPattern())
    @id = 2

  getPattern: ->
    speedPerLevel = 0.015
    level = @getLevel(6, 3)
    speed = Math.round((0.5 + speedPerLevel * (level + config.bossDifficulty)) * 100) / 100
    interval = 1500 - 50 * (levelManager.level + config.bossDifficulty)
    options = [speed, interval]
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*10)+1)
      attacks.push [4 + attack, 4 + attack - 20]
    return [options, attacks]