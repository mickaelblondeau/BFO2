class HUD
  constructor: ->
    @hud = {
      left: [
        {
          text: "'Level : ' + levelManager.level"
        }
      ]
      right: [
        {
          icon: 'jumpHeightBonus'
          text: "bonusManager.playerBonuses.jumpHeightBonus + '/' + bonusManager.bonuses[4].max"
        }
        {
          icon: 'speedBonus'
          text: "bonusManager.playerBonuses.speedBonus + '/' + bonusManager.bonuses[3].max"
        }
        {
          icon: 'autoRezBonus'
          text: "bonusManager.playerBonuses.autoRezBonus + '/' + bonusManager.bonuses[5].max"
        }
        {
          icon: 'tpBonus'
          text: "bonusManager.playerBonuses.tpBonus + '/' + bonusManager.bonuses[6].max + ' (T)'"
        }
        {
          icon: 'doubleJumpBonus'
          text: "player.availableDoubleJump"
        }
        {
          icon: 'grabbingBonus'
          text: "player.availableGrab"
        }
        {
          icon: 'jumpBlockBonus'
          text: "bonusManager.playerBonuses.jumpBlockBonus + '/' + bonusManager.bonuses[7].max + ' (Y)'"
        }
      ]
    }
    @elements = {
      left: []
      right: []
    }
    @drawHUD()

  update: (frameTime) ->
    for elm, i in @hud.left
      @elements.left[i].setText(eval(elm.text))
    for elm, i in @hud.right
      @elements.right[i].setText(eval(elm.text))
    hudLayer.draw()

  drawHUD: ->
    for elm, i in @hud.left
      tmp = new Kinetic.Text
        y: arena.y - @elements.left.length * 32
        fill: 'black'
        fontFamily: 'Calibri'
        fontSize: 18
      hudLayer.add tmp
      @elements.left[i] = tmp

    for elm, i in @hud.right
      if elm.icon isnt undefined
        icon = new Sprite(stage.getWidth() - 128 + 16, arena.y - @elements.right.length * 36, SquareEnum.SMALL, 'bonus', elm.icon)
        icon = icon.shape
        hudLayer.add icon
        tmp = new Kinetic.Text
          y: arena.y - @elements.right.length * 36 + 10
          x: stage.getWidth() - 128 + 64
          fill: 'black'
          fontFamily: 'Calibri'
          fontSize: 18
        hudLayer.add tmp
        @elements.right[i] = tmp
      else
        tmp = new Kinetic.Text
          y: arena.y - @elements.right.length * 36
          x: stage.getWidth() - 128
          fill: 'black'
          fontFamily: 'Calibri'
          fontSize: 18
        hudLayer.add tmp
        @elements.right[i] = tmp