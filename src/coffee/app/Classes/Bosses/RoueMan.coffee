class RoueMan extends Boss
  constructor: (pattern) ->
    y = stage.getY() * -1
    super('roueman', 0, y, 64, 64)
    @attacks = pattern
    @attackIndex = 0
    @attackSpeed = 0.6
    @start()

  start: ->
    @moveY(arena.y - levelManager.levelHeight - 128, '+', 'next')

  moveX: (x, side, next) ->
    self = @
    bossManager.update = (frameTime) ->
      if side is '+'
        tmp = self.shape.getX() + frameTime * self.attackSpeed
      else if side is '-'
        tmp = self.shape.getX() - frameTime * self.attackSpeed
      if (side is '+' and tmp < x) or (side is '-' and tmp > x)
        self.shape.setX(tmp)
      else
        self.shape.setX(x)
        if next is 'return'
          self.moveY(arena.y - levelManager.levelHeight - 128, '-', 'return')
        else if next is 'next'
          self.next()

  moveY: (y, side, next) ->
    self = @
    bossManager.update = (frameTime) ->
      if side is '+'
        tmp = self.shape.getY() + frameTime * self.attackSpeed
      else if side is '-'
        tmp = self.shape.getY() - frameTime * self.attackSpeed
      if (side is '+' and tmp < y) or (side is '-' and tmp > y)
        self.shape.setY(tmp)
      else
        self.shape.setY(y)
        if next is 'attack'
          self.moveX(config.levelWidth - 64, '+', 'return')
        else if next is 'return'
          self.moveX(0, '-', 'next')
        else if next is 'next'
          self.next()

  next: ->
    tmp = @attacks[@attackIndex]
    if tmp isnt undefined
      @moveY(arena.y - levelManager.levelHeight - tmp*32, '+', 'attack')
      @attackIndex++
    else
      @finish()