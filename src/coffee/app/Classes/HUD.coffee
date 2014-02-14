class HUD
  constructor: ->
    @buffs = []
    @drawHUD()

  update: (frameTime) ->
    text = 'Level : ' + Math.round(levelManager.level/2)
    if text != @level.getText()
      @level.setText(text)

    text = 'Jump : ' + Math.floor(player.jumpHeight/32*100)/100
    if text != @jump.getText()
      @jump.setText(text)

    text = 'Speed : ' + Math.floor(player.speed/config.playerSpeed*100) + "%"
    if text != @speed.getText()
      @speed.setText(text)

    text = 'Double Jumps : ' + player.availableDoubleJump
    if text != @doubleJump.getText()
      @doubleJump.setText(text)

    text = 'Hook time : ' + Math.round(player.availableGrab/10)
    if text != @grabbing.getText()
      @grabbing.setText(text)

    text = 'FPS : ' + Math.round(1000/game.fps)
    if text != @fps.getText()
      @fps.setText(text)

    hudLayer.draw()

  drawHUD: ->
    @level = new Kinetic.Text
      y: arena.y - 20
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

    @fps = new Kinetic.Text
      y: arena.y
      x: 0
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @fps