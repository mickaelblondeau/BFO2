class RoueMan extends Boss
  constructor: ->
    super('roueman', 15000, @getPattern())
    @id = 1

  getPattern: ->
    speedPerLevel = 0.05
    speed = Math.round((0.6 + speedPerLevel * levelManager.level) * 100) / 100
    options = speed
    attacks = []
    for i in [0..5]
      rand = Math.floor((Math.random()*100)+1)
      if rand >= 50
        attacks.push 3
      else
        attacks.push 1
    return [options, attacks]