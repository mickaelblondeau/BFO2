bonusEvents = [
  'resurection',
  'bonuses',
  'tp'
]

Bonuses = [
  1, 2, 3, 4, 6, 7, 8, 9
]

class Event
  constructor: ->
    @id = Math.floor((Math.random()*bonusEvents.length))
    @send()
    if @id is 1
      @spawnBonuses()

  send: ->
    networkManager.sendRandomEvent(@id)
    if @id is 0 and game.restartTimer isnt null
      clearTimeout(game.restartTimer)

  spawnBonuses: ->
    for i in [1..4]
      rand = Math.floor((Math.random()*12))
      randType = Math.floor(Math.random() * Bonuses.length)
      new Bonus(rand, 0, { id: Bonuses[randType] })