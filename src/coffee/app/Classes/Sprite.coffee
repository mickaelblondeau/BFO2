SquareEnum = {
  SMALL : { x: 32, y: 32 }
  MEDIUM : { x: 64, y: 64 }
  LARGE : { x: 128, y: 128 }
  MEDIUM_RECT : { x: 64, y: 32 }
  LARGE_RECT : { x: 128, y: 64 }
  LONG_RECT : { x: 32, y: 128 }
  BONUS : { x: 20, y: 20 }
}

spriteAnimations = {
  # PLAYER ANIMATIONS
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
  }],

  # CUBE ANIMATIONS
  '32-32': [{
    x: 192
    y: 96
    width: 32
    height: 32
  }],
  '64-64': [{
    x: 128
    y: 64
    width: 64
    height: 64
  }],
  '128-128': [{
    x: 0
    y: 0
    width: 128
    height: 128
  }],
  '64-32': [{
    x: 192
    y: 64
    width: 64
    height: 32
  }],
  '128-64': [{
    x: 128
    y: 0
    width: 128
    height: 64
  }],
  '32-128': [{
    x: 256
    y: 0
    width: 32
    height: 128
  }],
  'brokenCube': [{
    x: 224
    y: 96
    width: 32
    height: 32
  }],

  # SPECIAL CUBES ANIMAtiONS
  'iceExplosion': [{
    x: 0
    y: 0
    width: 64
    height: 64
  }],
  'explosion': [{
    x: 64
    y: 0
    width: 64
    height: 64
  }],
  'ice': [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  'stompblock': [{
    x: 128
    y: 0
    width: 64
    height: 64
  }],
  'swapblock': [{
    x: 64
    y: 64
    width: 64
    height: 64
  }],
  'tpblock': [{
    x: 128
    y: 64
    width: 64
    height: 64
  }],
  'randblock': [{
    x: 0
    y: 128
    width: 64
    height: 64
  }],
  'randomEvent': [{
    x: 64
    y: 128
    width: 64
    height: 64
  }],
  'slowblock': [{
    x: 0
    y: 64
    width: 64
    height: 64
  }],

  # EFFECT ANIMATIONS
  'blood': [{
    x: 160
    y: 0
    width: 64
    height: 64
  }, {
    x: 224
    y: 0
    width: 64
    height: 64
  }, {
    x: 288
    y: 0
    width: 64
    height: 64
  }, {
    x: 352
    y: 0
    width: 64
    height: 64
  }, {
    x: 416
    y: 0
    width: 64
    height: 64
  }, {
    x: 480
    y: 0
    width: 64
    height: 64
  }],
  'explosionEffect': [{
    x: 0
    y: 32
    width: 160
    height: 128
  }, {
    x: 160
    y: 32
    width: 160
    height: 128
  }, {
    x: 320
    y: 32
    width: 160
    height: 128
  }, {
    x: 480
    y: 32
    width: 160
    height: 128
  }, {
    x: 0
    y: 160
    width: 160
    height: 128
  }, {
    x: 160
    y: 160
    width: 160
    height: 128
  }, {
    x: 320
    y: 160
    width: 160
    height: 128
  }, {
    x: 480
    y: 160
    width: 160
    height: 128
  }, {
    x: 0
    y: 288
    width: 160
    height: 128
  }, {
    x: 160
    y: 288
    width: 160
    height: 128
  }],
  'iceExplosionEffect': [{
    x: 0
    y: 416
    width: 160
    height: 128
  }, {
    x: 160
    y: 416
    width: 160
    height: 128
  }, {
    x: 320
    y: 416
    width: 160
    height: 128
  }, {
    x: 480
    y: 416
    width: 160
    height: 128
  }, {
    x: 0
    y: 544
    width: 160
    height: 128
  }, {
    x: 160
    y: 544
    width: 160
    height: 128
  }, {
    x: 320
    y: 544
    width: 160
    height: 128
  }, {
    x: 480
    y: 544
    width: 160
    height: 128
  }, {
    x: 0
    y: 672
    width: 160
    height: 128
  }, {
    x: 160
    y: 672
    width: 160
    height: 128
  }],
  'slow': [{
    x: 32
    y: 0
    width: 32
    height: 32
  }],
  'bioExplosion': [{
    x: 0
    y: 834
    width: 128
    height: 128
  }, {
    x: 128
    y: 834
    width: 128
    height: 128
  }, {
    x: 256
    y: 834
    width: 128
    height: 128
  }, {
    x: 384
    y: 834
    width: 128
    height: 128
  }, {
    x: 512
    y: 834
    width: 128
    height: 128
  }, {
    x: 640
    y: 834
    width: 128
    height: 128
  }],
  'missileEffect': [{
    x: 0
    y: 32
    width: 32
    height: 32
  }, {
    x: 32
    y: 32
    width: 32
    height: 32
  }, {
    x: 64
    y: 32
    width: 32
    height: 32
  }],
  'smallExplosionEffect': [{
    x: 0
    y: 960
    width: 64
    height: 64
  }, {
    x: 64
    y: 960
    width: 64
    height: 64
  }, {
    x: 128
    y: 960
    width: 64
    height: 64
  }, {
    x: 192
    y: 960
    width: 64
    height: 64
  }, {
    x: 0
    y: 1024
    width: 64
    height: 64
  }, {
    x: 64
    y: 1024
    width: 64
    height: 64
  }, {
    x: 128
    y: 1024
    width: 64
    height: 64
  }, {
    x: 192
    y: 1024
    width: 64
    height: 64
  }, {
    x: 0
    y: 1088
    width: 64
    height: 64
  }, {
    x: 64
    y: 1088
    width: 64
    height: 64
  }],

  # BONUS ANIMATIONS
  speedBonus: [{
    x: 102
    y: 0
    width: 32
    height: 32
  }],
  jumpHeightBonus: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  doubleJumpBonus: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  grabbingBonus: [{
    x: 34
    y: 0
    width: 32
    height: 32
  }],
  resurectionBonus: [{
    x: 68
    y: 0
    width: 32
    height: 32
  }],
  tp: [{
    x: 0
    y: 34
    width: 32
    height: 32
  }],

  # BOSSES
  roueman: [{
    x: 0
    y: 0
    width: 63
    height: 64
  }, {
    x: 64
    y: 0
    width: 63
    height: 64
  }, {
    x: 128
    y: 0
    width: 63
    height: 64
  }],
  freezeman: [{
    x: 0
    y: 65
    width: 544
    height: 30
  }],
  poingman: [{
    x: 256
    y: 0
    width: 64
    height: 64
  }],
  labiman: [{
    x: 192
    y: 0
    width: 64
    height: 64
  }],
  sparkman: [{
    x: 0
    y: 128
    width: 64
    height: 64
  }, {
    x: 64
    y: 128
    width: 64
    height: 64
  }, {
    x: 128
    y: 128
    width: 64
    height: 64
  }],
  spark: [{
    x: 0
    y: 96
    width: 32
    height: 32
  }, {
    x: 32
    y: 96
    width: 32
    height: 32
  }, {
    x: 64
    y: 96
    width: 32
    height: 32
  }],
  homingman: [{
    x: 192
    y: 96
    width: 64
    height: 64
  }],
  missileman: [{
    x: 448
    y: 0
    width: 32
    height: 64
  }],
  powerSpark: [{
    x: 96
    y: 96
    width: 32
    height: 32
  }, {
    x: 128
    y: 96
    width: 32
    height: 32
  }],
  phantom: [{
    x: 160
    y: 96
    width: 32
    height: 32
  }]
}

class Sprite
  constructor: (x, y, size, spriteSheet, animation) ->
    @shape = new Kinetic.Sprite
      x: x
      y: y
      width: size.x
      height: size.y
      image: contentLoader.images[spriteSheet]
      animation: animation
      animations: spriteAnimations
      frameRate: 7
      index: 0
      transformsEnabled: 'position'

  getSpriteSheet: ->
    sheets = ["cubes_red", "cubes_green", "cubes_blue"]
    return sheets[Math.floor((Math.random()*sheets.length))]