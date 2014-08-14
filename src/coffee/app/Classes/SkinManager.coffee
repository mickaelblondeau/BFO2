class SkinManager
  constructor: ->
    @parts = ['skin', 'leg', 'head', 'beard', 'hair', 'body', 'shoes', 'hat']
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

  randomizeSkin: ->
    for part in @parts
      value = Math.floor(Math.random()*config.skins[part]) + 1
      elm = document.querySelector('#skin-preview .' + part)
      elm.style.background = 'url("assets/player/'+part+'/'+value+'.png") 140px 0'
      skin[part] = value
      document.querySelector('#skin-control .'+part+' .number').innerHTML = value