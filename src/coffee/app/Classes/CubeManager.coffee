class CubeManager
  constructor: ->
    @speed = 0.4

  reinitAllPhys: ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getName().type is 'cube'
        obj = cube.getName()
        if obj is null or obj is undefined
          obj = {}
        obj.falling = true
        cube.setName(obj)

  reinitPhys: (oldCube) ->
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getName().type is 'cube'
        if cube.getY() < oldCube.getY() && cube.getX() >= oldCube.getX() && cube.getX() <= oldCube.getX() + oldCube.getWidth()
          obj = cube.getName()
          if obj is null or obj is undefined
            obj = {}
          obj.falling = true
          cube.setName(obj)

  update: (frameTime) ->
    self = @
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if cube.getName() isnt undefined and cube.getName() isnt null and cube.getName().falling
        collide = self.testMove(cube, cube.getY() + self.speed*frameTime)
        if collide
          cube.setY(collide.getY() - cube.getHeight())
          obj = cube.getName()
          if obj is null or obj is undefined
            obj = {}
          obj.falling = false
          cube.setName(obj)
          self.reinitPhys(cube)
          if cube.getId() isnt undefined
            self.doEffect(cube, cube.getId())
        else
          cube.setY(cube.getY() + 0.1*frameTime)

  getCollisions: (shape) ->
    result = []
    thisBoundBox = collisionManager.getBoundBox(shape)
    cubes = staticCubes.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(thisBoundBox, cubeBoundBox)
        result.push(cube)
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if shape._id isnt cube._id and cube.getName() isnt undefined and cube.getName() isnt null and cube.getName().type is 'cube'
        cubeBoundBox = collisionManager.getBoundBox(cube)
        if collisionManager.colliding(thisBoundBox, cubeBoundBox)
          result.push(cube)
    return result

  testMove: (shape, y) ->
    shape.setY(y)
    collisions = @getCollisions(shape)
    for collision in collisions
      return collision
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
    contentLoader.play('explosion')
    new Effect(shape.getX() - shape.getWidth()/2 - 16, shape.getY() - shape.getHeight()/2 - 32, SquareEnum.SMALL, 'iceExplosionEffect', true)
    staticCubes.find('Sprite').each (cube) ->
      if cube.getX() < shape.getX() + 128 and cube.getX() > shape.getX() - 96 and cube.getY() < shape.getY() + 128 and cube.getY() > shape.getY() - 96
        for i in [0..(cube.getWidth()/32)-1]
          new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'ice')
    dynamicEntities.find('Sprite').each (cube) ->
      if !cube.getName().falling and cube.getName().type is 'cube'
        if cube.getX() < shape.getX() + 128 and cube.getX() > shape.getX() - 96 and cube.getY() < shape.getY() + 128 and cube.getY() > shape.getY() - 96
          for i in [0..(cube.getWidth()/32)-1]
            new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'ice')
    shape.destroy()

  slowExplosionEffet: (shape) ->
    contentLoader.play('death')
    new Effect(shape.getX() - shape.getWidth()/2, shape.getY() - shape.getHeight()/2, SquareEnum.SMALL, 'bioExplosion', true)
    staticCubes.find('Sprite').each (cube) ->
      if cube.getX() < shape.getX() + 96 and cube.getX() > shape.getX() - 64 and cube.getY() < shape.getY() + 128 and cube.getY() > shape.getY() - 64
        for i in [0..(cube.getWidth()/32)-1]
          new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'slow')
    dynamicEntities.find('Sprite').each (cube) ->
      if !cube.getName().falling and cube.getName().type is 'cube'
        if cube.getX() < shape.getX() + 96 and cube.getX() > shape.getX() - 64 and cube.getY() < shape.getY() + 128 and cube.getY() > shape.getY() - 64
          for i in [0..(cube.getWidth()/32)-1]
            new Effect(cube.getX() + i * 32, cube.getY() - 2, SquareEnum.SMALL, 'slow')
    shape.destroy()

  explosionEffet: (shape) ->
    contentLoader.play('explosion')
    new Effect(shape.getX() - shape.getWidth()/2 - 16, shape.getY() - shape.getHeight()/2 - 32, SquareEnum.SMALL, 'explosionEffect', true)
    arr = []
    dynamicEntities.find('Sprite').each (cube) ->
      if !cube.getName().falling and cube.getName().type is 'cube'
        if cube.getWidth() > 32 or cube.getHeight() > 32
          for i in [0..(cube.getWidth()/32-1)]
            for j in [0..(cube.getHeight()/32-1)]
              if arr[(cube.getX() + i*32) + "_" + cube.getY() + j*32] is undefined
                arr[(cube.getX() + i*32) + "_" + cube.getY() + j*32] = 1
                new CubeFragment(cube.getX() + i*32, cube.getY() + j*32, SquareEnum.SMALL)
          cube.destroy()
    dynamicEntities.find('Sprite').each (cube) ->
      for i in [-4..5]
        j = i
        if i > 0
          j = i-1
        if cube.getX() is shape.getX() + i*32 and cube.getY() < shape.getY() - (-5 + Math.abs(j))*32 and cube.getY() > shape.getY() + (-5 + Math.abs(j))*32
          cube.destroy()
    if player.shape.getX() < shape.getX() + 96 and player.shape.getX() > shape.getX() - 96 and player.shape.getY() < shape.getY() + 96 and player.shape.getY() > shape.getY() - 96
      player.kill()
    @reinitAllPhys()

  stompEffet: (shape) ->
    contentLoader.play('explosion')
    if !player.jump
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
    positions = []
    players.find('Rect').each (plr) ->
      if plr._id isnt player.shape._id
        skin = players.find('#skin-' + plr.getId())[0]
        if skin.getAnimation() isnt 'dead'
          positions.push({ x: plr.getX(), y: plr.getY() })
    if positions.length > 0
      rand = Math.floor((Math.random()*positions.length))
      player.shape.setX(positions[rand].x)
      player.shape.setY(positions[rand].y)
      player.jump = false
    shape.destroy()

  tpEffet: (shape) ->
    contentLoader.play('explosion')
    pos = { x: shape.getX() + 16, y: shape.getY() }
    shape.destroy()
    player.shape.setX(pos.x)
    player.shape.setY(pos.y)
    player.jump = false