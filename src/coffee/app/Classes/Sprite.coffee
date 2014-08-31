SquareEnum = {
  SMALL : { x: 32, y: 32 }
  MEDIUM : { x: 64, y: 64 }
  LARGE : { x: 128, y: 128 }
  MEDIUM_RECT : { x: 64, y: 32 }
  LARGE_RECT : { x: 128, y: 64 }
  LONG_RECT : { x: 32, y: 128 }
  BONUS : { x: 20, y: 20 }
  EFFECT : { x: 32, y: 12 }
  HALF_SMALL : { x: 32, y: 16 }
}

spriteAnimations = {
  # PLAYER ANIMATIONS
  idle: [
    288, 0, 48, 64
  ]
  jump: [
    336, 0, 48, 64
  ]
  fall: [
    384, 0, 48, 64
  ]
  run: [
    0, 0, 48, 64
    48, 0, 48, 64
    96, 0, 48, 64
    144, 0, 48, 64
    192, 0, 48, 64
    240, 0, 48, 64
  ]
  couch: [
    0, 64, 48, 64
  ]
  couchMove: [
    48, 64, 48, 64
    96, 64, 48, 64
    144, 64, 48, 64
    192, 64, 48, 64
    240, 64, 48, 64
  ]
  grabbing: [
    0, 128, 48, 64
  ]
  dead: [
    288, 64, 48, 64
  ]
  # CUBE ANIMATIONS
  '32-32': [192, 96, 32, 32]
  '64-64': [128, 64, 64, 64]
  '128-128': [0, 0, 128, 128]
  '64-32': [192, 64, 64, 32]
  '128-64': [128, 0, 128, 64]
  '32-128': [256, 0, 32, 128]
  brokenCube: [224, 96, 32, 32]
  # SPECIAL CUBES ANIMATIONS
  iceExplosion: [0, 0, 64, 64]
  explosion: [64, 0, 64, 64]
  ice: [0, 0, 32, 12]
  stompblock: [128, 0, 64, 64]
  swapblock: [128, 64, 64, 64]
  tpblock: [64, 64, 64, 64]
  randblock: [0, 128, 64, 64]
  randomEvent: [64, 128, 64, 64]
  slowblock: [0, 64, 64, 64]
  jumpBlock: [64, 0, 32, 32]
  # EFFECT ANIMATIONS
  blood: [
    160, 0, 64, 64
    224, 0, 64, 64
    288, 0, 64, 64
    352, 0, 64, 64
    416, 0, 64, 64
    480, 0, 64, 64
  ]
  explosionEffect: [
    0, 32, 160, 128
    160, 32, 160, 128
    320, 32, 160, 128
    480, 32, 160, 128
    0, 160, 160, 128
    160, 160, 160, 128
    320, 160, 160, 128
    480, 160, 160, 128
    0, 288, 160, 128
    160, 288, 160, 128
  ]
  iceExplosionEffect: [
    0, 416, 160, 128
    160, 416, 160, 128
    320, 416, 160, 128
    480, 416, 160, 128
    0, 544, 160, 128
    160, 544, 160, 128
    320, 544, 160, 128
    480, 544, 160, 128
    0, 672, 160, 128
    160, 672, 160, 128
  ]
  slow: [
    32, 0, 32, 12
  ]
  bioExplosion: [
    0, 834, 128, 128
    128, 834, 128, 128
    256, 834, 128, 128
    384, 834, 128, 128
    512, 834, 128, 128
    640, 834, 128, 128
  ]
  missileEffect: [
    0, 32, 32, 32
    32, 32, 32, 32
    64, 32, 32, 32
  ]
  smallExplosionEffect: [
    0, 960, 64, 64
    64, 960, 64, 64
    128, 960, 64, 64
    192, 960, 64, 64
    0, 1024, 64, 64
    64, 1024, 64, 64
    128, 1024, 64, 64
    192, 1024, 64, 64
    0, 1088, 64, 64
    64, 1088, 64, 64
  ]
  # BONUS ANIMATIONS
  speedBonus: [
    64, 32, 32, 32
  ]
  jumpHeightBonus: [
    32, 32, 32, 32
  ]
  doubleJumpBonus: [
    0, 64, 32, 32
  ]
  grabbingBonus: [
    0, 0, 32, 32
  ]
  resurectionBonus: [
    96, 0, 32, 32
  ]
  autoRezBonus: [
    96, 32, 32, 32
  ]
  tpBonus: [
    64, 0, 32, 32
  ]
  jumpBlockBonus: [
    0, 32, 32, 32
  ]
  tp: [
    32, 0, 32, 32
  ]
  jetpackBonus: [
    32, 64, 32, 32
  ]
  jetpackOffBonus: [
    64, 64, 32, 32
  ]
  # BOSSES
  roueman: [
    0, 0, 64, 64
    64, 0, 64, 64
  ]
  freezeman: [
    0, 65, 544, 30
  ]
  poingman: [
    192, 0, 64, 64
  ]
  labiman: [
    128, 0, 64, 64
  ]
  sparkman: [
    0, 96, 64, 64
    64, 96, 64, 64
    128, 96, 64, 64
    192, 96, 64, 64
  ]
  spark: [
    0, 160, 32, 32
    32, 160, 32, 32
    64, 160, 32, 32
    96, 160, 32, 32
  ]
  homingman: [
    256, 0, 64, 64
  ]
  missileman: [
    320, 0, 32, 64
  ]
  phantom: [
    128, 160, 32, 32
  ]
  # MISC
  fly: [
    0, 0, 32, 32
    32, 0, 32, 32
    64, 0, 32, 32
  ]
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

  getSpriteSheet: ->
    sheets = ["cubes_red", "cubes_green", "cubes_blue"]
    return sheets[Math.floor((Math.random()*sheets.length))]