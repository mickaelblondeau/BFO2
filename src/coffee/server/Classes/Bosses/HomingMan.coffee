class HomingMan extends Boss
  constructor: ->
    super('homingman', 20000, @getPattern())
    @id = 6

  getPattern: ->
    levelManager.level = 8
    speed = Math.round((0.5 + 0.03 * levelManager.level) * 100) / 100
    attackSpeed = Math.round((0.25 + 0.001 * (levelManager.level - 1)) * 100) / 100
    interval = 3000
    options = [speed, attackSpeed, interval]
    attacks = 4
    return [options, attacks]