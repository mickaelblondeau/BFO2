class Boss
  constructor: (type, x, y, w, h) ->
    @type = type
    @x = x
    @y = y
    @w = w
    @h = h
    @origin = { x: 0, y: 0 }
    @bossTypes = {
      roueman: [{
        x: 0
        y: 0
        width: 63
        height: 64
      }, {
        x: 64
        y: 0
        width: 63
        height: 64
      }, {
        x: 128
        y: 0
        width: 63
        height: 64
      }],
      freezeman: [{
        x: 0
        y: 65
        width: 544
        height: 32
      }],
      poingman: [{
        x: 256
        y: 0
        width: 64
        height: 64
      }],
      labiman: [{
        x: 192
        y: 0
        width: 64
        height: 64
      }],
      sparkman: [{
        x: 0
        y: 128
        width: 64
        height: 64
      }, {
        x: 64
        y: 128
        width: 64
        height: 64
      }, {
        x: 128
        y: 128
        width: 64
        height: 64
      }],
      spark: [{
        x: 0
        y: 96
        width: 32
        height: 32
      }, {
        x: 32
        y: 96
        width: 32
        height: 32
      }, {
        x: 64
        y: 96
        width: 32
        height: 32
      }],
      homingman: [{
        x: 192
        y: 96
        width: 64
        height: 64
      }],
      missileman: [{
        x: 448
        y: 0
        width: 32
        height: 64
      }],
      powerSpark: [{
        x: 96
        y: 96
        width: 32
        height: 32
      }, {
        x: 128
        y: 96
        width: 32
        height: 32
      }],
      phantom: [{
        x: 160
        y: 96
        width: 32
        height: 32
      }]
    }
    @draw()

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: @w
      height: @h
      image: contentLoader.images['boss']
      animation: @type
      animations: @bossTypes
      frameRate: 10
      index: 0
      name: { type: 'boss', name: @type }
      stroke: 'black'
      strokeWidth: 1
      strokeEnabled: true
    dynamicEntities.add @shape
    @shape.start()

  finish: ->
    bossManager.stopUpdate()
    @shape.destroy()
    networkManager.sendBossBeaten()

  reset: ->
    @shape.destroy()

  move: (frameTime, x, y) ->
    speed = @speed * frameTime

    if @origin.x > x
      tmp = @shape.getX() - speed
      if tmp > x
        @shape.setX(tmp)
      else
        @shape.setX(x)
        @origin.x = x
    else if @origin.x < x
      tmp = @shape.getX() + speed
      if tmp < x
        @shape.setX(tmp)
      else
        @shape.setX(x)
        @origin.x = x

    if @origin.y > y
      tmp = @shape.getY() - speed
      if tmp > y
        @shape.setY(tmp)
      else
        @shape.setY(y)
        @origin.y = y
    else if @origin.y < y
      tmp = @shape.getY() + speed
      if tmp < y
        @shape.setY(tmp)
      else
        @shape.setY(y)
        @origin.y = y

    if @shape.getX() is x and @shape.getY() is y
      return true
    else
      return false