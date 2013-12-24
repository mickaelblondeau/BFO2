class ImageLoader
  constructor: ->
    @imagesToLoad = []
    @images = []

  addLoad: (image) ->
    @imagesToLoad.push(image)

  load: ->
    self = @
    count = 0
    total = @imagesToLoad.length
    for img in @imagesToLoad
      imageObj = new Image()
      imageObj.src = img.url
      @images[img.name] = imageObj
      imageObj.onload = ->
        count++
        if count is total
          self.imagesLoaded()

  imagesLoaded: ->
