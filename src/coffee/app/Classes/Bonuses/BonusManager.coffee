class BonusManager
  constructor: ->
    @bonuses = [
      {
        name: 'doubleJump'
        attribute: 'jumpCount'
        value: 1
        time: 3000
      }
    ]

  getBonus: (bonusName, player) ->
    for bonus in @bonuses
      if bonusName is bonus.name
        @addBonus(bonus, player)
        if bonus.time isnt undefined
          self = @
          setTimeout(
            () ->
              self.removeBonus(bonus, player)
            , bonus.time
          )

  addBonus: (bonus, player) ->
    switch bonus.attribute
      when "speed"
        player.speed += bonus.value
      when "jumpHeight"
        player.jumpHeight += bonus.value
      when "jumpCount"
        player.jumpMax += bonus.value

  removeBonus: (bonus, player) ->
    switch bonus.attribute
      when "speed"
        player.speed -= bonus.value
      when "jumpHeight"
        player.jumpHeight -= bonus.value
      when "jumpCount"
        player.jumpMax -= bonus.value