class LabiManPart extends Boss
  constructor: ->
    y = arena.y - levelManager.levelHeight + 32
    super('freezeman', 80, y, 544, 32)