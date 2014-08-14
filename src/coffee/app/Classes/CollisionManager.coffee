class CollisionManager
  constructor: ->

  getBoundBox: (shape) ->
    return {
      top: shape.getY()
      bottom: shape.getY() + shape.getHeight()
      left: shape.getX()
      right: shape.getX() + shape.getWidth()
    }

  colliding: (a, b) ->
    return !((a.left >= b.right) || (a.right <= b.left) || (a.top >= b.bottom) || (a.bottom <= b.top))

  collidingCorners: (a, b) ->
    return ((b.right >= a.left && b.right < a.right && b.top >= a.top && b.top < a.bottom) or (b.left >= a.left && b.left < a.right && b.top >= a.top && b.top < a.bottom)) and a.top > b.top - 5

  isCubeGrabbable: (cube, player) ->
    if player.getX() > cube.getX()
      if @pointInCube(player, {x: cube.getX() + 16, y: cube.getY() + 80})
        return false
    else
      if @pointInCube(player, {x: cube.getX() - 16, y: cube.getY() + 80})
        return false
    return true

  getAllCollisions: (shape) ->
    return @getStaticCollisions(shape).concat(@getDynamicCollisions(shape))

  getStaticCollisions: (shape) ->
    result = []
    thisBoundBox = @getBoundBox(shape)
    cubes = staticCubes.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(thisBoundBox, cubeBoundBox)
        result.push(cube)
    return result

  getDynamicCollisions: (shape) ->
    result = []
    thisBoundBox = @getBoundBox(shape)
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      cubeBoundBox = collisionManager.getBoundBox(cube)
      if collisionManager.colliding(thisBoundBox, cubeBoundBox)
        result.push(cube)
    return result

  getCubeCollisions: (shape) ->
    result = []
    thisBoundBox = @getBoundBox(shape)
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if shape._id isnt cube._id and cube.getName() isnt undefined and cube.getName() isnt null and cube.getName().type is 'cube' and !cube.getName().falling
        cubeBoundBox = collisionManager.getBoundBox(cube)
        if collisionManager.colliding(thisBoundBox, cubeBoundBox)
          result.push(cube)
    return result.concat(@getStaticCollisions(shape))

  getPlayerSkin: (shape) ->
    return players.find('#skin-' + shape.getId())[0]

  getPlayerCollision: ->
    response = false
    playerBoundBox = collisionManager.getBoundBox(player.shape)
    players.find('Rect').each (plr) ->
      if plr.getId() isnt undefined
        skin = collisionManager.getPlayerSkin(plr)
        if skin isnt undefined and plr.getName() is 'otherPlayer' and skin.getAnimation() is 'couch'
          otherPlayerBoundBox = collisionManager.getBoundBox(plr)
          if collisionManager.colliding(playerBoundBox, otherPlayerBoundBox)
            response = true
    return response

  getCornerCollisions: ->
    result = []
    playerBoundBox = @getBoundBox(player.shape)
    playerBoundBox.left -= 4
    playerBoundBox.right += 4
    cubes = dynamicEntities.find('Sprite')
    cubes.each (cube) ->
      if !cube.getName().falling and cube.getName().type is 'cube'
        cubeBoundBox = collisionManager.getBoundBox(cube)
        if collisionManager.colliding(playerBoundBox, cubeBoundBox) and ((cubeBoundBox.left < playerBoundBox.left and player.skin.getScaleX() is -1) or (cubeBoundBox.left > playerBoundBox.left and player.skin.getScaleX() is 1))
          if collisionManager.collidingCorners(playerBoundBox, cubeBoundBox) and collisionManager.isCubeGrabbable(cube, player.shape)
            result.push(cube)
    return result

  pointInCube: (shape, point) ->
    return point[0] >= shape.getX() and point[0] < shape.getX() + shape.getWidth() and point[1] >= shape.getY() and point[1] < shape.getY() + shape.getHeight()