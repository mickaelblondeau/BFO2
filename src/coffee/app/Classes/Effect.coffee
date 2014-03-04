class Effect extends Sprite
  constructor: (x, y, size, anim, hasCycle) ->
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