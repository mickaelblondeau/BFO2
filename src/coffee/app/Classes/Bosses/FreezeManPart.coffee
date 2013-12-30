class FreezeManPart extends Boss
  constructor: (x) ->
    y = stage.getY() * -1
    super(0, 'freezeman', x, y, 544, 32)