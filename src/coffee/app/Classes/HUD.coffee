class HUD
  constructor: ->
    @level
    @buffs = []
    @drawLevel()

  update: (frameTime) ->
    levelText = 'Level : ' + levelManager.level
    if levelText != @level.getText()
      @level.setText(levelText)
    @updateBuffs(frameTime)
    hudLayer.draw()

  drawLevel: ->
    @level = new Kinetic.Text
      text: 'Level : 0'
      fill: 'black'
      fontFamily: 'Calibri'
      fontSize: 18
    hudLayer.add @level

  addBuff: (id, buff, time) ->
    @buffs.push { id: id, buff: buff, time: time }

    buff = new Kinetic.Sprite
      x: 608
      y: 0
      width: 32
      height: 32
      image: imageLoader.images['bonus']
      animation: buff
      animations: bonusTypes
      frameRate: 0
      index: 0
      id: id
    hudLayer.add buff

    if time isnt undefined
      timer = new Kinetic.Text
        x: 640
        y: 0
        text: time
        fill: 'black'
        fontFamily: 'Calibri'
        fontSize: 18
        id: 'txt' + id
        name: 'timer'
      hudLayer.add timer

  deleteBuff: (id) ->
    hudLayer.find('Text').each (txt) ->
      if txt.getId() is 'txt' + id
        txt.destroy()
    hudLayer.find('Sprite').each (icon) ->
      if icon.getId() is id
        icon.destroy()

  updateBuffs: (frameTime) ->
    y = 2
    hudLayer.find('Sprite').each (icon) ->
      txt = hudLayer.find('#txt' + icon.getId())[0]
      if txt isnt undefined
        txt.setY(y)
      icon.setY(y)
      y += 34
    hudLayer.find('Text').each (txt) ->
      if txt.getName() is 'timer'
        if txt.getText() - frameTime >= 0
          txt.setText(txt.getText() - frameTime)
        else
          txt.setText(0)

  reset: ->
    hudLayer.find('Text').each (txt) ->
      if txt.getName() is 'timer'
        txt.destroy()
    hudLayer.find('Sprite').each (icon) ->
      icon.destroy()