class MissileManPart extends Boss
  constructor: (x, y, destination) ->
    super('missileman', x, y, 32, 32)
    @launching = true
    @alive = true
    side = 1
    @effect = new Effect(x, y, SquareEnum.SMALL, 'missileEffect')
    @destination = destination

    @changeSide(side)

  changeSide: (side) ->
    if side is 1
      @effect.shape.setScaleY(-1)
      @effect.shape.setY(@shape.getY() + 95)
    else
      @shape.setScaleY(-1)
      @effect.shape.setScaleY(1)
      @effect.shape.setY(@shape.getY() - 95)

  reset: ->
    if @alive
      super()
      @effect.shape.destroy()
      @alive = false
      bossManager.currentBoss.attackFinished++

      contentLoader.play('explosion')
      effect = new Effect(@shape.getX() - 16, @shape.getY() - 64, SquareEnum.MEDIUM, 'smallExplosionEffect', true)

      playerBoundBox = collisionManager.getBoundBox(player.shape)
      effectBoundBox = collisionManager.getBoundBox(effect.shape)
      if collisionManager.colliding(playerBoundBox, effectBoundBox)
        player.kill()