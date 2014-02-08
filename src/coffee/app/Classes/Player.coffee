class Player
  constructor: (skin) ->
    @heightCouched = 30
    @height = 46
    @active = false
    @playerSkin = skin

    @draw()
    @spawn()

    self = @
    callback = (image) ->
      self.skin.setImage(image)
      self.fixSkinPos()
    skinManager.createSkin(skin, callback, self.skin._id)

  draw: ->
    @shape = new Kinetic.Rect
      width: 22
      height: @height
      stroke: null
    players.add @shape

    animations = {
      idle: [{
        x: 288
        y: 0
        width: 48
        height: 48
      }],
      jump: [{
        x: 336
        y: 0
        width: 48
        height: 48
      }],
      fall: [{
        x: 384
        y: 0
        width: 48
        height: 48
      }],
      run: [{
        x: 0
        y: 0
        width: 48
        height: 48
      }, {
        x: 48
        y: 0
        width: 48
        height: 48
      }, {
        x: 96
        y: 0
        width: 48
        height: 48
      }, {
        x: 144
        y: 0
        width: 48
        height: 48
      }, {
        x: 192
        y: 0
        width: 48
        height: 48
      }, {
        x: 240
        y: 0
        width: 48
        height: 48
      }],
      couch: [{
        x: 0
        y: 48
        width: 48
        height: 48
      }],
      couchMove: [{
        x: 48
        y: 48
        width: 48
        height: 48
      }, {
        x: 96
        y: 48
        width: 48
        height: 48
      }, {
        x: 144
        y: 48
        width: 48
        height: 48
      }, {
        x: 192
        y: 48
        width: 48
        height: 48
      }, {
        x: 240
        y: 48
        width: 48
        height: 48
      }],
      grabbing: [{
        x: 0
        y: 96
        width: 48
        height: 48
      }],
      dead: [{
        x: 288
        y: 48
        width: 48
        height: 48
      }]
    }

    @animationsIndex = [
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

    @skin = new Kinetic.Sprite
      image: contentLoader.images['playerSpirteSheet']
      animation: 'run',
      animations: animations,
      frameRate: 7,
      index: 0
    players.add @skin
    @skin.start()

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
    @grabbing = false
    @canGrab = false
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
    for anim in @animationsIndex
      if anim.id is index
        return anim.name

  getIndexByAnimation: (animation) ->
    for anim in @animationsIndex
      if anim.name is animation
        return anim.id