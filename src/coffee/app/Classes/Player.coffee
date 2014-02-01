class Player
  constructor: () ->
    @heightCouched = 30
    @height = 46
    @draw()
    @spawn()

  draw: ->
    @shape = new Kinetic.Rect
      width: 22
      height: @height
      stroke: null
    players.add @shape

    animations = {
      idle: [{
        x: 290
        y: 2
        width: 46
        height: 45
      }],
      jump: [{
        x: 339
        y: 2
        width: 45
        height: 45
      }],
      fall: [{
        x: 387
        y: 2
        width: 46
        height: 45
      }],
      run: [{
        x: 0
        y: 2
        width: 46
        height: 45
      }, {
        x: 49
        y: 2
        width: 46
        height: 45
      }, {
        x: 97
        y: 2
        width: 46
        height: 45
      }, {
        x: 145
        y: 2
        width: 46
        height: 45
      }, {
        x: 193
        y: 2
        width: 46
        height: 45
      }, {
        x: 241
        y: 2
        width: 46
        height: 45
      }],
      couch: [{
        x: 0
        y: 63
        width: 46
        height: 34
      }],
      couchMove: [{
        x: 50
        y: 67
        width: 46
        height: 30
      }, {
        x: 98
        y: 67
        width: 46
        height: 30
      }, {
        x: 146
        y: 67
        width: 46
        height: 30
      }, {
        x: 194
        y: 67
        width: 46
        height: 30
      }, {
        x: 242
        y: 67
        width: 46
        height: 30
      }],
      grabbing: [{
        x: 0
        y: 98
        width: 46
        height: 48
      }],
      dead: [{
        x: 290
        y: 49
        width: 48
        height: 48
      }]
    }

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

  kill: ->
    if @alive
      @alive = false
      contentLoader.play('death')

  fixSkinPos: ->
    if @skin.getScaleX() is -1
      @skin.setX(@shape.getX() - 12 + 48)
    else
      @skin.setX(@shape.getX() - 12)
    if @skin.getAnimation() is 'couch'
      @skin.setY(@shape.getY() - 4)
    else
      @skin.setY(@shape.getY())

  changeAnimation: (animation) ->
    if @skin.getAnimation() != animation
      @skin.setAnimation(animation)

  changeSide: (side) ->
    if side is -1
      @skin.setScaleX(-1)
      @skin.setX(@skin.getX() + 48)
    else if side is 1
      @skin.setScaleX(1)
      @skin.setX(@skin.getX() - 48)