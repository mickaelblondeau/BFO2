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
      },
      {
        name: 'resurection'
        attribute: 'resurection'
      },
      {
        name: 'speed'
        attribute: 'speed'
        value: 0.03
      },
      {
        name: 'jumpHeight'
        attribute: 'jumpHeight'
        value: 5
      },
    ]
    @timers = []

  getBonus: (bonusName, player, bonusId) ->
    contentLoader.sounds['pickup'].play()
    for bonus in @bonuses
      if bonusName is bonus.name
        @addBonus(bonus, player)
        hud.addBuff(bonusName, bonus.time)
        if bonus.time isnt undefined
          self = @
          thisBonus = bonus
          callback = () ->
            self.removeBonus(thisBonus, player)
            hud.deleteBuff(bonusName)
          @timers.push setTimeout(callback, bonus.time)

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