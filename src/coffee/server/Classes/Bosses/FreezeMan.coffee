class FreezeMan extends Boss
  constructor: ->
    super('freezeman', 15000, @getPattern())

  getPattern: ->
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*10)+1)
      if i % 2 == 0
        attacks.push -16 + attack
      else
        attacks.push 3 + attack
    return attacks