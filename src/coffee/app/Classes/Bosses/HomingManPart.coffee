class HomingManPart extends Boss
  constructor: (x, y, life, target) ->
    super('spark', x, y, 32, 32)
    @target = target
    @boostSpeed = 0.2

    self = @

    fn = ->
      bossManager.currentBoss.attackFinished++
      self.reset()

    setTimeout(fn, life)