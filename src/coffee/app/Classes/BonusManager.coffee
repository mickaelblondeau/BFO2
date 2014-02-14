class BonusManager
  constructor: ->
    @bonuses = [
      {
        name: 'doubleJump'
        attribute: 'jumpCount'
        value: 1
      },
      {
        name: 'grabbing'
        attribute: 'grab'
        value: 20
      },
      {
        name: 'resurection'
        attribute: 'resurection'
      },
      {
        name: 'speed'
        attribute: 'speed'
        value: 0.015
      },
      {
        name: 'jumpHeight'
        attribute: 'jumpHeight'
        value: 3
      },
    ]
    @timers = []

  getBonus: (bonusName, player) ->
    contentLoader.play('pickup')
    for bonus in @bonuses
      if bonusName is bonus.name
        @addBonus(bonus, player)

  addBonus: (bonus, player) ->
    switch bonus.attribute
      when "speed"
        player.speed += bonus.value
      when "jumpHeight"
        player.jumpHeight += bonus.value
      when "jumpCount"
        player.availableDoubleJump += bonus.value
      when "grab"
        player.availableGrab += bonus.value
      when "resurection"
        networkManager.sendResurection()
        player.resurection()

  removeBonus: (bonus, player) ->
    switch bonus.attribute
      when "speed"
        player.speed -= bonus.value
      when "jumpHeight"
        player.jumpHeight -= bonus.value
      when "jumpCount"
        player.jumpMax -= bonus.value
      when "canGrab"
        player.canGrab = false

  reset: ->
    for timer in @timers
      clearInterval(timer)

  remove: (id) ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getId() is id
        cube.destroy()
        dynamicEntities.draw()