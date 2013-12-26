class RoueMan extends Boss
  constructor: ->
    super('roueman', 15000, @getPattern())

  getPattern: ->
    attacks = []
    for i in [0..5]
      rand = Math.floor((Math.random()*100)+1)
      if rand >= 50
        attacks.push 3
      else
        attacks.push 1
    return attacks