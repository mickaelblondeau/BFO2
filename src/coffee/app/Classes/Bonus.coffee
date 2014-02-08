bonusTypes = {
  speed: [{
    id: 1
    name: 'speed'
    x: 96
    y: 0
    width: 32
    height: 32
  }],
  jumpHeight: [{
    id: 2
    name: 'jumpHeight'
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  doubleJump: [{
    id: 3
    name: 'doubleJump'
    x: 0
    y: 0
    width: 32
    height: 32
  }],
  grabbing: [{
    id: 4
    name: 'grabbing'
    x: 32
    y: 0
    width: 32
    height: 32
  }],
  resurection: [{
    id: 5
    name: 'resurection'
    x: 64
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