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
  constructor: ->
    @id = Math.floor((Math.random()*bonusEvents.length))
    @send()
    if @id is 1
      @spawnBonuses()

  send: ->
    networkManager.sendRandomEvent(@id)
    if @id is 0 and @restartTimer isnt null
      @restartTimer = null

  spawnBonuses: ->
    for i in [1..4]
      rand = Math.floor((Math.random()*12))
      randType = Math.floor((Math.random()*(Bonuses.length - 1))) + 1
      new Bonus(rand, 0, { id: randType })