class PoingMan extends Boss
  constructor: ->
    super('poingman', 15000, @getPattern())
    @id = 3

  getPattern: ->
    speed = Math.round((0.4 + 0.1 * levelManager.level) * 100) / 100
    attackSpeed = Math.round((0.6 + 0.1 * levelManager.level) * 100) / 100
    options = [speed, attackSpeed]
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*10))
      attacks.push attack
    return [options, attacks]