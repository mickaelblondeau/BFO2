class HomingManPart extends Boss
  constructor: (x, y, life, target) ->
    super('spark', x, y, 32, 32)
    @target = target
    @boostSpeed = 0.2
    @alive = true

    self = @

    fn = ->
      self.reset()
    setTimeout(fn, life)

  reset: ->
    if @alive
      @alive = false
      bossManager.currentBoss.attackFinished++
      super()