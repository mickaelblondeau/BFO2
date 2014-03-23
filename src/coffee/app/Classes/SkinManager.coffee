class SkinManager
  constructor: ->
    @parts = ['skin', 'hair', 'head', 'body', 'leg', 'shoes']
    @skins = []
    @callback = []

  createSkin: (parts, callback, id) ->
    @callback[id] = callback
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
          self.createSheet(images, id)

  createSheet: (images, id) ->
    self = @
    for image in images
      shape = new Kinetic.Image
        image: image
      tmpLayer.add shape
    tmpLayer.draw()
    tmpLayer.toImage
      callback: (image) ->
        self.callback[id](image)
        delete self.callback[id]
    tmpLayer.destroyChildren()
    tmpLayer.draw()

  setSkin: (part, value) ->
    elm = document.querySelector('#skin-preview .' + part)
    elm.style.background = 'url("assets/player/'+part+'/'+value+'.png") 140px 0'
    skin[part] = value
    document.querySelector('#skin-control .'+part+' .number').innerHTML = value

  getSkin: (part) ->
    return document.querySelector('#skin-control .'+part+' .number').innerHTML