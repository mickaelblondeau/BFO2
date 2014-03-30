bonusEvents = [
  'resurection',
  'bonuses',
  'tp'
]

Bonuses = [
  'speed',
  'jumpHeight',
  'doubleJump',
  'grabbing'
]

class Event
  constructor: (id) ->
    @id = id
    @send()
    if @id is 1
      fn = ->
        @spawnBonuses()
      setTimeout(fn, 2000)

  send: ->
    networkManager.sendRandomEvent(@id)

  spawnBonuses: ->
    for i in [1..4]
      rand = Math.floor((Math.random()*12))
      randType = Math.floor((Math.random()*(Bonuses.length - 1))) + 1
      new Bonus(rand, 0, { id: randType })