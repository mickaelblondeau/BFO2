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

  addBuff: (buffType, time) ->
    @buffs.push { buff: buffType, time: time }

    if hudLayer.find('#' + buffType)[0] isnt undefined
      count = hudLayer.find('#count' + buffType)[0]
      count.setText((parseInt(count.getText().split(' x ')) + 1) + ' x ')
      if time isnt undefined
        timer = hudLayer.find('#timer' + buffType)[0]
        timer.setText(time/1000)
    else
      buff = new Kinetic.Sprite
        x: 618
        y: 0
        width: 32
        height: 32
        image: imageLoader.images['bonus']
        animation: buffType
        animations: bonusTypes
        frameRate: 0
        index: 0
        id: buffType
      hudLayer.add buff

      if time isnt undefined
        timer = new Kinetic.Text
          x: 658
          y: 0
          text: time/1000
          fill: 'black'
          fontFamily: 'Calibri'
          fontSize: 18
          id: 'timer' + buffType
          name: 'timer'
        hudLayer.add timer
        timer.setAttr('currentTime', time/1000)

      count = new Kinetic.Text
        x: 590
        y: 0
        text: '1 x '
        fill: 'black'
        fontFamily: 'Calibri'
        fontSize: 18
        id: 'count' + buffType
        name: 'count'
      hudLayer.add count

  deleteBuff: (buffType) ->
    buff = hudLayer.find('#' + buffType)[0]
    count = hudLayer.find('#count' + buffType)[0]
    text = hudLayer.find('#timer' + buffType)[0]
    if buff isnt undefined
      if count isnt undefined
        if count.getText() is '1 x '
          buff.destroy()
          count.destroy()
          if text isnt undefined
            text.destroy()
        else
          count.setText((parseInt(count.getText().split(' x ')) - 1) + ' x ')
      else
        buff.destroy()
        count.destroy()
        if text isnt undefined
          text.destroy()

  updateBuffs: (frameTime) ->
    y = 0
    hudLayer.find('Sprite').each (icon) ->
      timer = hudLayer.find('#timer' + icon.getId())[0]
      if timer isnt undefined
        timer.setY(y + 8)
      count = hudLayer.find('#count' + icon.getId())[0]
      if count isnt undefined
        count.setY(y + 8)
      icon.setY(y)
      y += 40
    hudLayer.find('Text').each (timer) ->
      if timer.getName() is 'timer'
        newTime = timer.getAttr('currentTime') - frameTime/1000
        if newTime < 0
          newTime = 0
        timer.setAttr('currentTime', newTime)
        timer.setText(Math.round(newTime*100)/100)

  reset: ->
    hudLayer.find('Text').each (timer) ->
      if timer.getName() is 'timer' or timer.getName() is 'count'
        timer.destroy()
    hudLayer.find('Sprite').each (icon) ->
      icon.destroy()