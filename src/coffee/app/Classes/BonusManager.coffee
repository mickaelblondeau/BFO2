class BonusManager
  constructor: ->
    @bonuses = [
      {
        name: 'doubleJump'
        attribute: 'jumpCount'
        value: 1
        time: 3000
      },
      {
        name: 'grabbing'
        attribute: 'canGrab'
        value: true
        time: 10000
      }
    ]
    @timers = []

  getBonus: (bonusName, player) ->
    for bonus in @bonuses
      if bonusName is bonus.name
        @addBonus(bonus, player)
        if bonus.time isnt undefined
          self = @
          @timers.push setTimeout(
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
      when "canGrab"
        player.canGrab = true

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