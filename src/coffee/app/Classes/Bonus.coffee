bonusTypes = {
  jumpHeight: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  doubleJump: [{
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  grabbing: [{
    x: 34
    y: 0
    width: 32
    height: 32
  }],
  resurection: [{
    x: 68
    y: 0
    width: 32
    height: 32
  }],
  speed: [{
    x: 102
    y: 0
    width: 32
    height: 32
  }]
}

bonusTypesId = [{
  id: 1
  name: 'speed'
}, {
  id: 2
  name: 'jumpHeight'
}, {
  id: 3
  name: 'doubleJump'
}, {
  id: 4
  name: 'grabbing'
}, {
  id: 5
  name: 'resurection'
}]

class Bonus
  constructor: (col, typeId, id) ->
    for type in bonusTypesId
      if typeId is type.id
        @type = type.name
    @id = id
    @x = col * 32 + 160 + 6
    @y = stage.getY() * -1
    @draw()

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: 20
      height: 20
      image: contentLoader.images['bonus']
      animation: @type
      animations: bonusTypes
      frameRate: 0
      index: 0
      name: { type: 'bonus', name: @type, falling: true }
      id: 'bonus' + @id
      offsetX: 6
      offsetY: 12
    dynamicEntities.add @shape