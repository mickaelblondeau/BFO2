SquareEnum = {
  SMALL : { x: 32, y: 32 }
  MEDIUM : { x: 64, y: 64 }
  LARGE : { x: 128, y: 128 }
  MEDIUM_RECT : { x: 64, y: 32 }
  LARGE_RECT : { x: 128, y: 64 }
  LONG_RECT : { x: 32, y: 128 }
}

class Cube
  constructor: (x, y, size, spriteSheet, animation) ->
    @x = x
    @y = y
    @size = size
    @spriteSheet = spriteSheet
    @animation = animation
    @cubesTypes = {
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
      }]
    }
    @draw()

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: @size.x
      height: @size.y
      image: contentLoader.images[@spriteSheet]
      animation: @animation
      animations: @cubesTypes
      frameRate: 7
      index: 0