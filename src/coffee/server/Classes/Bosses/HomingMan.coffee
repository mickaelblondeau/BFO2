class HomingMan extends Boss
  constructor: ->
    super('homingman', 20000, @getPattern())
    @id = 6

  getPattern: ->
    speed = Math.round((0.5 + 0.03 * levelManager.level) * 100) / 100
    attackSpeed = Math.round((0.05 + 0.005 * (levelManager.level - 1)) * 100) / 100
    interval = 8000
    options = [speed, attackSpeed, interval]
    attacks = 2
    return [options, attacks]