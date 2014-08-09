class CubeManager
  constructor: ->
    @speed = 0.4
    @tweens = []

  update: (frameTime) ->
    self = @
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getName() isnt undefined and cube.getName() isnt null and cube.getName().falling
        collide = self.testMove(cube, cube.getY() + self.speed*frameTime)
        if collide
          cube.setY(collide.getY() - cube.getHeight())
          obj = cube.getName()
          obj.falling = false
          cube.setName(obj)
          if cube.getId() isnt undefined
            self.doEffect(cube, cube.getId())
        else
          cube.setY(cube.getY() + 0.1*frameTime)
    @reinitBonusPhysic()

  reinitBonusPhysic: ->
    shapes = dynamicEntities.find('Sprite')
    shapes.each (shape) ->
      if shape.getName() isnt undefined and shape.getName().type is 'bonus' and collisionManager.checkPresence(shape.getX() + 8, shape.getY() + shape.getHeight() + 8)
        obj = shape.getName()
        obj.falling = true
        shape.setName(obj)

  testMove: (shape, y) ->
    shape.setY(y)
    collisions = collisionManager.getCubeCollisions(shape)
    if collisions.length > 0
      return collisions[0]
    return false

  convertToStatic: ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getName().type is 'cube'
        cube.moveTo(staticCubes)
        cube.draw()

  convertToCube: (shape) ->
    obj = shape.getName()
    obj.type = 'cube'
    shape.setName(obj)

  doEffect: (shape, type) ->
    if type is 'iceExplosion'
      @iceExplosionEffect(shape)
    if type is 'slowblock'
      @slowExplosionEffet(shape)
    if type is 'stompblock'
      @stompEffet(shape)
    if type is 'swapblock'
      @swapEffet(shape)
    if type is 'tpblock'
      @tpEffet(shape)
    if type is 'randblock'
      @doEffect(shape, shape.getName().randType)

  iceExplosionEffect: (shape) ->
    new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'ice')
    new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'ice')
    @convertToCube(shape)

  slowExplosionEffet: (shape) ->
    new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'slow')
    new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'slow')
    @convertToCube(shape)

  stompEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true)
    if !player.jump and !player.falling
      player.setTempJumpHeight(300)
      player.jumpStart = player.shape.getY()
      player.jumpCount = player.jumpMax
      player.stomped = true
      player.jump = true
    @convertToCube(shape)

  swapEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true)
    positions = []
    players.find('Rect').each (plr) ->
      if plr._id isnt player.shape._id
        skin = players.find('#skin-' + plr.getId())[0]
        if skin.getAnimation() isnt 'dead'
          couched = false
          if skin.getAnimation() is 'couch' or skin.getAnimation() is 'couchMove'
            couched = true
          positions.push({ x: plr.getX(), y: plr.getY(), couched: couched })
    if positions.length > 0
      rand = Math.floor((Math.random()*positions.length))
      player.shape.setX(positions[rand].x)
      player.shape.setY(positions[rand].y)
      player.grabbing = false
      if positions[rand].couched
        player.startCouch()
      player.jump = false
    @convertToCube(shape)

  tpEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true)
    player.shape.setX(shape.getX() + 16)
    player.shape.setY(shape.getY() - 64)
    player.jump = false
    @convertToCube(shape)

  sendJumpBlock: (x, y) ->
    @tmp = new Effect(x + 6, y, SquareEnum.BONUS, 'jumpBlock')
    obj = @tmp.shape.getName()
    obj.falling = true
    @tmp.shape.setName(obj)
    @tmp.shape.setOffsetX(6)
    @tmp.shape.setOffsetY(12)

  sendLootBonus: (x, y, id) ->
    @tmp = new Bonus(0, id, x + y)
    @tmp.shape.setX(x + 6)
    @tmp.shape.setY(y)