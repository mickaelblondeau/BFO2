class Effect extends Sprite
  constructor: (x, y, size, anim, hasCycle, engineAnimation) ->
    if engineAnimation isnt undefined
      super(x, y, size, 'bonus', anim)
      dynamicEntities.add @shape
      @shape.setName({ type: 'effect', name: anim })
      @shape.draw()

      @shape.setX(@shape.getX() + 16)
      @shape.setY(@shape.getY() + 16)
      shape = @shape
      tween = new Kinetic.Tween
        node: @shape
        duration: 0.3
        scaleX: 2
        scaleY: 2
        x: x
        y: y
        onFinish: ->
          shape.destroy()
      tween.play()
      cubeManager.tweens.push(tween)
    else
      super(x, y, size, 'effects', anim)
      dynamicEntities.add @shape
      @shape.setName({ type: 'effect', name: anim })
      @shape.draw()

      if anim is 'explosionEffect' or anim is 'iceExplosionEffect' or anim is 'smallExplosionEffect'
        @shape.setFrameRate(20)
      else if anim is 'blood' or anim is 'bioExplosion'
        @shape.setFrameRate(16)

      @shape.start()

      if hasCycle isnt undefined
        self = @
        len = @shape.getAnimations()[@shape.getAnimation()].length - 1
        @shape.afterFrame(len, () ->
          self.shape.destroy()
        )