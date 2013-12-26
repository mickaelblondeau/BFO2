class Bonus
  constructor: (col, destination, type, id) ->
    @id = id
    @type = type
    @x = col * 32 + 160
    @y = stage.getY() * -1
    @bonusesTypes = {
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
      }]
    }
    @draw()

    @destination = arena.y - destination * 32 - 32
    @diffY = @destination - @y
    @speed = 600
    @fall()

  fall: ->
    tween = new Kinetic.Tween
      node: @shape
      duration: @diffY/@speed
      y: @destination
    tween.play()

  draw: ->
    @shape = new Kinetic.Sprite
      x: @x
      y: @y
      width: 32
      height: 32
      image: imageLoader.images['bonus']
      animation: @type
      animations: @bonusesTypes
      frameRate: 0
      index: 0
      name: { type: 'bonus', name: @type }
      id: 'bonus' + @id
    dynamicEntities.add @shape