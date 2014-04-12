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
        value: 2
      },
      {
        name: 'resurectionBonus'
        attribute: 'resurection'
      },
      {
        name: 'speedBonus'
        attribute: 'speed'
        value: 0.03
        max: 3
      },
      {
        name: 'jumpHeightBonus'
        attribute: 'jumpHeight'
        value: 18
        max: 3
      },
      {
        name: 'autoRezBonus'
        attribute: 'rezBonus'
        value: 1
        max: 1
      },
      {
        name: 'tpBonus'
        attribute: 'tpBonus'
        value: 1
        max: 2
      },
    ]
    @playerBonuses = {}
    @resetBonuses()

  resetBonuses: ->
    @playerBonuses = {
      jumpHeightBonus: 0
      speedBonus: 0
      autoRezBonus: 0
      tpBonus: 0
    }

  getBonus: (bonusName) ->
    bonus = @findBonus(bonusName)
    if @canTake(bonus)
      contentLoader.play('pickup')
      @addBonus(bonus)
      return true
    else
      return false

  canTake: (bonus) ->
    if bonus.max isnt undefined
      switch bonus.attribute
        when "speed"
          return @playerBonuses.speedBonus < bonus.max
        when "jumpHeight"
          return @playerBonuses.jumpHeightBonus < bonus.max
        when "rezBonus"
          return @playerBonuses.autoRezBonus < bonus.max
        when "tpBonus"
          return @playerBonuses.tpBonus < bonus.max
        else
          return false
    else
      return true

  findBonus: (bonusName) ->
    for bonus in @bonuses
      if bonusName is bonus.name
        return bonus

  addBonus: (bonus) ->
    switch bonus.attribute
      when "speed"
        player.speed += bonus.value
        @playerBonuses.speedBonus++
      when "jumpHeight"
        player.addJumpHeight(bonus.value)
        @playerBonuses.jumpHeightBonus++
      when "jumpCount"
        player.availableDoubleJump += bonus.value
      when "grab"
        player.availableGrab += bonus.value
      when "resurection"
        networkManager.sendResurection()
        player.resurection()
      when "rezBonus"
        @playerBonuses.autoRezBonus++
      when "tpBonus"
        @playerBonuses.tpBonus++

  remove: (id) ->
    bonus = dynamicEntities.find('#' + id)
    bonus.destroy()