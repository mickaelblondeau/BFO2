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
          if obj.child isnt undefined
            for child in obj.child
              child.shape.setY(cube.getY() - 2)
          cube.setName(obj)
          if cube.getId() isnt undefined
            self.doEffect(cube, cube.getId())
        else
          cube.setY(cube.getY() + 0.1*frameTime)
          obj = cube.getName()
          if obj isnt null and obj isnt undefined and obj.child isnt undefined
            for child in obj.child
              child.shape.setY(cube.getY() - 2)

  reinitPhysic: ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      obj = cube.getName()
      if obj.type == 'cube' or obj.type == 'bonus'
        obj.falling = true
        cube.setName(obj)

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

  doEffect: (shape, type) ->
    if type is 'iceExplosion'
      @iceExplosionEffect(shape)
    if type is 'explosion'
      @explosionEffet(shape)
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
    e1 = new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'ice')
    e2 = new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'ice')
    obj = shape.getName()
    obj.type = 'cube'
    obj.child = [e1, e2]
    shape.setName(obj)

  slowExplosionEffet: (shape) ->
    e1 = new Effect(shape.getX(), shape.getY() - 2, SquareEnum.EFFECT, 'slow')
    e2 = new Effect(shape.getX() + 32, shape.getY() - 2, SquareEnum.EFFECT, 'slow')
    obj = shape.getName()
    obj.type = 'cube'
    obj.child = [e1, e2]
    shape.setName(obj)

  explosionEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX() - shape.getWidth()/2 - 16, shape.getY() - shape.getHeight()/2 - 32, SquareEnum.SMALL, 'explosionEffect', true)
    map = @createExplosionMap(shape.getX(), shape.getY())
    shape.destroy()
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      for pos in map
        if collisionManager.pointInCube(cube, pos)
          obj = cube.getName()
          if obj isnt null and obj isnt undefined and obj.child isnt undefined
            for child in obj.child
              child.shape.destroy()
          cube.destroy()
    @reinitPhysic()

  createExplosionMap: (x, y) ->
    map = []
    for i in [-1..2]
      for j in [-1..2]
        map.push([x + i * 32, y + j * 32])
    return map

  stompEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true)
    if !player.jump and !player.falling
      player.oldStats = {
        jumpHeight: player.jumpHeight
        jumpMinAcceleration: player.jumpMinAcceleration
        jumpMaxAcceleration: player.jumpMaxAcceleration
        jumpDeceleration: player.jumpDeceleration
      }
      player.jumpStart = player.shape.getY()
      player.jumpHeight = 300
      player.jumpMinAcceleration = 0.1
      player.jumpMaxAcceleration = 1.5
      player.jumpCurrentAcceleration = player.jumpMaxAcceleration
      player.jumpDeceleration = 0.92
      player.jumpCount = player.jumpMax
      player.stomped = true
      player.jump = true
    shape.destroy()

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
    shape.destroy()

  tpEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX(), shape.getY(), SquareEnum.SMALL, 'tp', null, true)
    pos = { x: shape.getX() + 16, y: shape.getY() }
    shape.destroy()
    player.shape.setX(pos.x)
    player.shape.setY(pos.y)
    player.jump = false