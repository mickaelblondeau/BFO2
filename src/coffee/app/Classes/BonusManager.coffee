class BonusManager
  constructor: ->
    @bonuses = [
      {
        name: 'doubleJumpBonus'
        attribute: 'jumpCount'
        value: 1
      },
      {
        name: 'grabbingBonus'
        attribute: 'grab'
        value: 20
      },
      {
        name: 'resurectionBonus'
        attribute: 'resurection'
      },
      {
        name: 'speedBonus'
        attribute: 'speed'
        value: 0.015
      },
      {
        name: 'jumpHeightBonus'
        attribute: 'jumpHeight'
        value: 3
      },
    ]
    @timers = []

  getBonus: (bonusName) ->
    contentLoader.play('pickup')
    for bonus in @bonuses
      if bonusName is bonus.name
        @addBonus(bonus)

  addBonus: (bonus) ->
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

  remove: (id) ->
    bonus = dynamicEntities.find('#' + id)
    bonus.destroy()