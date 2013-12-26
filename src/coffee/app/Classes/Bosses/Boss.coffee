class Boss
  constructor: (id, type, x, y, w, h) ->
    @id = id
    @type = type
    @x = x
    @y = y
    @w = w
    @h = h
    @bossTypes = {
      roueman: [{
        x: 0
        y: 0
        width: 64
        height: 64
      }, {
        x: 64
        y: 0
        width: 64
        height: 64
      }, {
        x: 128
        y: 0
        width: 64
        height: 64
      }]
    }
    @draw()
    @tweens = []

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: @w
      height: @h
      image: imageLoader.images['boss']
      animation: @type
      animations: @bossTypes
      frameRate: 10
      index: 0
      name: { type: 'boss', name: @type }
      id: 'boss' + @id
    dynamicEntities.add @shape
    @shape.start()

  finish: ->
    @shape.destroy()
    dynamicEntities.draw()
    networkManager.sendBossBeaten()

  reset: ->
    for tween in @tweens
      tween.pause()