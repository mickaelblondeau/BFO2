class RoueMan extends Boss
  constructor: ->
    super('roueman', 15000, @getPattern())
    @id = 1

  getPattern: ->
    speedPerLevel = 0.03
    speed = Math.round((0.6 + speedPerLevel * levelManager.level) * 100) / 100
    options = speed
    attacks = @generateAttacks()
    return [options, attacks]

  generateAttacks: ->
    attacks = []
    attacks.push([0, 25])

    for i in [0..6]
      if Math.random() > 0.5
        side = 1
      else
        side = -1

      if Math.random() > 0.5
        attack = 6
      else
        attack = 4

      attacks.push([10 * side, 0])
      attacks.push([0, attack])
      attacks.push([-20 * side, 0])
      attacks.push([0, -attack])
      attacks.push([10 * side, 0])
    return attacks