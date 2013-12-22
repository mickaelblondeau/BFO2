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

  removeBonus: (bonus, player) ->
    switch bonus.attribute
      when "speed"
        player.speed -= bonus.value
      when "jumpHeight"
        player.jumpHeight -= bonus.value
      when "jumpCount"
        player.jumpMax -= bonus.value

  reset: ->
    for timer in @timers
      clearInterval(timer)

  remove: (id) ->
    cubes = fallingCubes.find('Rect')
    cubes.each (cube) ->
      if cube.getId() is id
        cube.destroy()
        fallingCubes.draw()