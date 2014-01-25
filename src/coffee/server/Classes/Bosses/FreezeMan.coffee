class FreezeMan extends Boss
  constructor: ->
    super('freezeman', 15000, @getPattern())

  getPattern: ->
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*10)+1)
      attacks.push [4 + attack, 4 + attack - 20]
    return attacks