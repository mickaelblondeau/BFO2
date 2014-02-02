class SkinManager
  constructor: ->
    @parts = ['skin', 'hair', 'head', 'body', 'leg', 'shoes']
    @skins = []

  createSkin: (parts, callback) ->
    @callback = callback
    self = @
    count = 0
    images = []
    img = null
    for part in @parts
      skin = new Image()
      skin.src = '../assets/player/'+part+'/' + parts[part] + '.png'
      images.push(skin)
      skin.onload = ->
        count++
        if count == self.parts.length
          self.createSheet(images, parts)

  createSheet: (images, parts) ->
    self = @
    tmpLayer = new Kinetic.Layer()
    stage.add tmpLayer
    for image in images
      shape = new Kinetic.Image
        image: image
      tmpLayer.add shape
    tmpLayer.toImage
      callback: (img) ->
        self.setSkin(img, parts)
        self.callback.call()
        tmpLayer.setZIndex(-10)

  setSkin: (img, parts) ->
    @skins[parts.skin + ":" + parts.hair + ":" + parts.head + ":" + parts.body + ":" + parts.leg + ":" + parts.shoes] = img

  getSkin: (parts) ->
    return @skins[parts.skin + ":" + parts.hair + ":" + parts.head + ":" + parts.body + ":" + parts.leg + ":" + parts.shoes]
