class Effect extends Cube
  constructor: (x, y, size, anim, hasCycle) ->
    super(x, y, size, 'effects', anim)
    dynamicEntities.add @shape
    @shape.setName({ type: 'effect', name: anim })
    @shape.draw()

    if anim is 'explosionEffect'
      @shape.setFrameRate(20)

    @shape.start()

    if hasCycle isnt undefined
      self = @
      len = @shape.getAnimations()[@shape.getAnimation()].length - 1
      @shape.afterFrame(len, () ->
        self.shape.destroy()
      )