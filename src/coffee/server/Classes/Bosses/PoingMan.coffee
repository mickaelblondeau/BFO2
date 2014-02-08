class PoingMan extends Boss
  constructor: ->
    super('poingman', 15000, @getPattern())

  getPattern: ->
    attacks = []
    for i in [0..5]
      attack = Math.floor((Math.random()*10))
      attacks.push attack
    return attacks