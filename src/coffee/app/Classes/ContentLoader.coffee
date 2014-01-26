class ContentLoader
  constructor: ->
    @imagesToLoad = []
    @soundsToLoad = []
    @images = []
    @sounds = []

    @count = 0
    @total = 0

  loadImage: (image) ->
    @imagesToLoad.push(image)

  loadSound: (sound) ->
    @soundsToLoad.push(sound)

  load: ->
    self = @
    @total = @imagesToLoad.length + @soundsToLoad.length

    for img in @imagesToLoad
      imageObj = new Image()
      imageObj.src = img.url
      @images[img.name] = imageObj
      imageObj.onload = ->
        self.count++
        if self.count is self.total
          self.contentsLoaded()

    for sound in @soundsToLoad
      audioObj = new Audio();
      audioObj.src = sound.url
      @sounds[sound.name] = audioObj
      audioObj.oncanplaythrough  = ->
        self.count++
        if self.count is self.total
          self.contentsLoaded()

  contentsLoaded: ->
