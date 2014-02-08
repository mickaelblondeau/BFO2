class Boss
  constructor: (type, x, y, w, h) ->
    @type = type
    @x = x
    @y = y
    @w = w
    @h = h
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
        y: 64
        width: 544
        height: 32
      }],
      poingman: [{
        x: 128
        y: 128
        width: 64
        height: 64
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