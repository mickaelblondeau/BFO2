class MissileMan extends Boss
  constructor: ->
    super('missileman', 15000, @getPattern())
    @id = 7

  getPattern: ->
    speed = Math.round((0.5 + 0.025 * levelManager.level) * 100) / 100
    interval = 500 - levelManager.level * 30
    options = [speed, interval]
    attacks = @genAttacks()
    return [options, attacks]

  genAttacks: ->
    attacks = []

    for i in [0..20]
      rand = Math.random()
      if rand < 0.25
        spawn = 32
      else if rand > 0.25 and rand < 0.5
        spawn = 64
      else if rand > 0.5 and rand < 0.74
        spawn = 608
      else
        spawn = 640
      attacks.push([spawn, (Math.floor((Math.random()*12)+1)) * 32 + 128])

    return attacks