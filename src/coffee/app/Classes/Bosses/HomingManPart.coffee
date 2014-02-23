class HomingManPart extends Boss
  constructor: (x, y, life, target) ->
    super('phantom', x, y, 32, 32)
    @target = target
    @alive = true
    @ratioX = 1

    self = @

    fn = ->
      self.reset()
    setTimeout(fn, life)

  reset: ->
    if @alive
      @alive = false
      bossManager.currentBoss.attackFinished++
      super()