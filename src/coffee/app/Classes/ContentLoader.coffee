class ContentLoader
  constructor: ->
    @imagesToLoad = []
    @soundsToLoad = []
    @images = []
    @sounds = []

    @count = 0
    @total = 0
    @musics = 0
    @currentSong

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
      audioObj = new Audio()
      audioObj.src = sound.url
      audioObj.volume = 0.1
      @sounds[sound.name] = audioObj
      audioObj.oncanplaythrough  = ->
        self.count++
        if self.count is self.total
          self.contentsLoaded()
      if sound.type is 'music'
        @musics++
        audioObj.addEventListener "ended", ->
          self.nextSong()

  contentsLoaded: ->

  muteEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        @sounds[sound.name].volume = 0
    document.querySelector('#sound-effect').innerHTML = 0

  muteMusic: ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        @sounds[sound.name].volume = 0
    document.querySelector('#sound-music').innerHTML = 0

  addVolumeEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        tmp = @sounds[sound.name].volume + 0.05
        if tmp <= 1
          @sounds[sound.name].volume = tmp
        else
          tmp = 1
          @sounds[sound.name].volume = tmp
      document.querySelector('#sound-effect').innerHTML = Math.floor(tmp*100)
      document.querySelector('#sound-mute-effect').className = 'un-muted'

  addVolumeMusic: ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        tmp = @sounds[sound.name].volume + 0.05
        if tmp <= 1
          @sounds[sound.name].volume = tmp
        else
          tmp = 1
          @sounds[sound.name].volume = tmp
    document.querySelector('#sound-music').innerHTML = Math.floor(tmp*100)
    document.querySelector('#sound-mute-music').className = 'un-muted'

  lessVolumeEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        tmp = @sounds[sound.name].volume - 0.05
        if tmp >= 0
          @sounds[sound.name].volume = tmp
        else
          tmp = 0
          @sounds[sound.name].volume = tmp
          document.querySelector('#sound-mute-effect').className = 'muted'
      document.querySelector('#sound-effect').innerHTML = Math.floor(tmp*100)

  lessVolumeMusic: ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        tmp = @sounds[sound.name].volume - 0.05
        if tmp >= 0
          @sounds[sound.name].volume = tmp
        else
          tmp = 0
          @sounds[sound.name].volume = tmp
          document.querySelector('#sound-mute-music').className = 'muted'
    document.querySelector('#sound-music').innerHTML = Math.floor(tmp*100)

  play: (sound) ->
    @sounds[sound].pause()
    @sounds[sound].currentTime = 0
    @sounds[sound].play()

  playSong: ->
    songNumber = Math.floor((Math.random()*@musics)+1)
    @currentSong = songNumber
    @sounds['music' + songNumber].play()

  nextSong: ->
    tmp = @currentSong + 1
    if tmp > @musics
      songNumber = 1
    else
      songNumber = tmp
    @sounds['music' + songNumber].play()
