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
      audioObj.volume = 0.1
      @sounds[sound.name] = audioObj
      audioObj.oncanplaythrough  = ->
        self.count++
        if self.count is self.total
          self.contentsLoaded()

  contentsLoaded: ->

  muteVolume: ->
    for sound in @soundsToLoad
      @sounds[sound.name].volume = 0

  addVolume: ->
    for sound in @soundsToLoad
      tmp = @sounds[sound.name].volume + 0.05
      if tmp <= 1
        @sounds[sound.name].volume = tmp
      else
        @sounds[sound.name].volume = 1

  lessVolume: ->
    for sound in @soundsToLoad
      tmp = @sounds[sound.name].volume - 0.05
      if tmp >= 0
        @sounds[sound.name].volume = tmp
      else
        @sounds[sound.name].volume = 0