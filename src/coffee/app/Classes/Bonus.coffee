bonusTypes = {
  doubleJump: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  grabbing: [{
    x: 32
    y: 0
    width: 32
    height: 32
  }],
  resurection: [{
    x: 64
    y: 0
    width: 32
    height: 32
  }],
  jumpHeight: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  speed: [{
    x: 96
    y: 0
    width: 32
    height: 32
  }],
}

class Bonus
  constructor: (col, type, id) ->
    @id = id
    @type = type
    @x = col * 32 + 160
    @y = stage.getY() * -1
    @draw()

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: 32
      height: 32
      image: contentLoader.images['bonus']
      animation: @type
      animations: bonusTypes
      frameRate: 0
      index: 0
      name: { type: 'bonus', name: @type, falling: true }
      id: 'bonus' + @id
    dynamicEntities.add @shape