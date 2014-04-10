class HUD
  constructor: ->
    @buffs = []
    @drawHUD()

  update: (frameTime) ->
    text = 'Level : ' + levelManager.level
    if text != @level.getText()
      @level.setText(text)

    text = 'Jump : ' + bonusManager.playerBonuses.jumpHeightBonus + '/' + bonusManager.bonuses[4].max
    if text != @jump.getText()
      @jump.setText(text)

    text = 'Speed : ' + bonusManager.playerBonuses.speedBonus + '/' + bonusManager.bonuses[3].max
    if text != @speed.getText()
      @speed.setText(text)

    text = 'Double Jumps : ' + player.availableDoubleJump
    if text != @doubleJump.getText()
      @doubleJump.setText(text)

    text = 'Hook time : ' + player.availableGrab
    if text != @grabbing.getText()
      @grabbing.setText(text)

    hudLayer.draw()

  drawHUD: ->
    @level = new Kinetic.Text
      y: arena.y
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @level

    @jump = new Kinetic.Text
      y: arena.y
      x: stage.getWidth() - 128
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @jump

    @speed = new Kinetic.Text
      y: arena.y - 20
      x: stage.getWidth() - 128
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @speed

    @doubleJump = new Kinetic.Text
      y: arena.y - 40
      x: stage.getWidth() - 128
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @doubleJump

    @grabbing = new Kinetic.Text
      y: arena.y - 60
      x: stage.getWidth() - 128
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @grabbing