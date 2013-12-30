class RoueMan extends Boss
  constructor: (id, pattern) ->
    y = stage.getY() * -1
    super(id, 'roueman', 0, y, 64, 64)

    @attacks = pattern
    @index = 0

    @start()

  attack: (level) ->
    self = @
    bossManager.tweens.push tween1 = new Kinetic.Tween
      node: @shape
      duration: 0.1
      y: arena.y - levelManager.levelHeight - level * 32
      onFinish: ->
        bossManager.tweens.push tween2 = new Kinetic.Tween
          node: self.shape
          duration: 1
          x: config.levelWidth - 64
          onFinish: ->
            bossManager.tweens.push tween3 = new Kinetic.Tween
              node: self.shape
              duration: 0.1
              y: arena.y - levelManager.levelHeight - 128
              onFinish: ->
                bossManager.tweens.push tween4 = new Kinetic.Tween
                  node: self.shape
                  duration: 0.5
                  x: 0
                  onFinish: ->
                    self.loop()
                tween4.play()
            tween3.play()
        tween2.play()
    tween1.play()

  loop: ->
    if @attacks[@index] isnt undefined
      @attack(@attacks[@index])
      @index++
    else
      @finish()

  start: ->
    self = @
    bossManager.tweens.push tween = new Kinetic.Tween
      node: @shape
      duration: 2
      y: arena.y - levelManager.levelHeight - 128
      onFinish: ->
        self.loop()
    tween.play()