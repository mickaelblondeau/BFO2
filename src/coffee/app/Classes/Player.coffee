playerAnimationIndexes = [
  {
    id: 1
    name: 'idle'
  }, {
    id: 2
    name: 'jump'
  }, {
    id: 3
    name: 'fall'
  }, {
    id: 4
    name: 'run'
  }, {
    id: 5
    name: 'couch'
  }, {
    id: 6
    name: 'couchMove'
  }, {
    id: 7
    name: 'grabbing'
  }, {
    id: 8
    name: 'dead'
  }
]

class Player
  constructor: (skin) ->
    @heightCouched = 30
    @height = 46

    @draw()

    self = @
    callback = (image) ->
      self.skin.setImage(image)
      self.fixSkinPos()
    skinManager.createSkin(skin, callback, self.skin._id)

  draw: ->
    @shape = new Kinetic.Rect
      width: 22
      height: @height
    players.add @shape

    @skin = new Sprite(0, 0, SquareEnum.SMALL, 'playerSpirteSheet', 'fall').shape

    players.add @skin
    @skin.start()

    @spawn()

  spawn: ->
    @shape.setX(336)
    @shape.setY(stage.getY() * -1)

  reset: ->
    @spawn()
    @alive = true
    @falling = true
    @jumpMax = config.playerJumpMax
    @speed = config.playerSpeed
    @jumpHeight = config.playerJumpHeight
    @availableDoubleJump = 0
    @availableGrab = 0
    @grabbing = false
    @coopJump = false

  resurection: ->
    if !@alive
      @reset()

  fixSkinPos: ->
    if @skin.getScaleX() is -1
      @skin.setX(@shape.getX() - 12 + 48)
    else
      @skin.setX(@shape.getX() - 12)
    if @skin.getAnimation() is 'couch' or @skin.getAnimation() is 'couchMove'
      @skin.setY(@shape.getY() - 18)
    else
      @skin.setY(@shape.getY())

  changeAnimation: (id) ->
    animation = @getAnimationByIndex(id)
    if @skin.getAnimation() != animation
      @skin.setAnimation(animation)
      @fixSkinPos()

  changeSide: (side) ->
    if side is -1
      @skin.setScaleX(-1)
      @skin.setX(@skin.getX() + 48)
    else if side is 1
      @skin.setScaleX(1)
      @skin.setX(@skin.getX() - 48)

  getAnimationByIndex: (index) ->
    for anim in playerAnimationIndexes
      if anim.id is index
        return anim.name

  getIndexByAnimation: (animation) ->
    for anim in playerAnimationIndexes
      if anim.name is animation
        return anim.id