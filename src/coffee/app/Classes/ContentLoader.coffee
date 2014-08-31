class ContentLoader
  constructor: ->
    @imagesToLoad = []
    @soundsToLoad = []
    @images = []
    @sounds = []

    @volumeStep = 0.01

    @count = 0
    @total = 0
    @musics = 0
    @currentSong

    @oldSoundLevel = 0
    @oldMusicLevel = 0

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
        self.updateLoader(@src)

    for sound in @soundsToLoad
      audioObj = new Audio()
      audioObj.src = sound.url
      audioObj.volume = 0.1
      if sound.title isnt undefined
        audioObj.title = sound.title
      @sounds[sound.name] = audioObj
      audioObj.oncanplaythrough  = ->
        self.updateLoader(@src)
      if sound.type is 'music'
        @musics++
        audioObj.addEventListener "ended", ->
          self.nextSong()

  updateLoader: (name) ->
    if @count < @total
      @count++
      tmp = name.split('/')
      file = tmp[tmp.length-1]
      document.querySelector('#login-loading').innerHTML = 'Loading ... <br> ' + file + '<br>' + Math.round((@count/@total)*100) + '%'
      if @count is @total
        @contentsLoaded()
        document.querySelector('#login-loading').innerHTML = ''

  contentsLoaded: ->

  muteEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        @oldSoundLevel = Math.floor(@sounds[sound.name].volume*100)/100
        @sounds[sound.name].volume = 0
    document.querySelector('#sound-effect').innerHTML = 0

  muteMusic: ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        @oldMusicLevel = Math.floor(@sounds[sound.name].volume*100)/100
        @sounds[sound.name].volume = 0
    document.querySelector('#sound-music').innerHTML = 0

  unmuteEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        @sounds[sound.name].volume = @oldSoundLevel
    document.querySelector('#sound-effect').innerHTML = @oldSoundLevel*100

  unmuteMusic: ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        @sounds[sound.name].volume = @oldMusicLevel
    document.querySelector('#sound-music').innerHTML = @oldMusicLevel*100

  addVolumeEffect: ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        tmp = @sounds[sound.name].volume + @volumeStep
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
        tmp = @sounds[sound.name].volume + @volumeStep
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
        tmp = @sounds[sound.name].volume - @volumeStep
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
        tmp = @sounds[sound.name].volume - @volumeStep
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

  playMusic: (sound) ->
    @sounds[sound].pause()
    @sounds[sound].currentTime = 0
    @sounds[sound].play()
    document.querySelector('#current-music').innerHTML = @sounds[sound].title

  playSong: ->
    songNumber = Math.floor((Math.random()*@musics)+1)
    @currentSong = songNumber
    @playMusic('music' + songNumber)

  nextSong: ->
    @sounds['music' + @currentSong].pause()
    @currentSong++
    if @sounds['music' + @currentSong] isnt undefined
      @playMusic('music' + @currentSong)
    else
      @playMusic('music1')
      @currentSong = 1

  prevSong: ->
    @sounds['music' + @currentSong].pause()
    @currentSong--
    if @sounds['music' + @currentSong] isnt undefined
      @playMusic('music' + @currentSong)
    else
      @currentSong = @musics
      @playMusic('music' + @currentSong)

  setEffectVolume: (vol) ->
    for sound in @soundsToLoad
      if sound.type is 'effect'
        @sounds[sound.name].volume = vol/100
    document.querySelector('#sound-effect').innerHTML = vol
    if parseInt(vol) is 0
      document.querySelector('#sound-mute-effect').className = 'muted'
      @oldSoundLevel = 0.1

  setMusicVolume: (vol) ->
    for sound in @soundsToLoad
      if sound.type is 'music'
        @sounds[sound.name].volume = vol/100
    document.querySelector('#sound-music').innerHTML = vol
    if parseInt(vol) is 0
      document.querySelector('#sound-mute-music').className = 'muted'
      @oldMusicLevel = 0.1

  setBG: (color) ->
    if color is "White"
      document.querySelector('body').style.background = "White"
      document.querySelector('#sound-controller').style.color = "Black"
      document.querySelector('#color-switch a').innerHTML = "White"
    else
      document.querySelector('body').style.background = "Black"
      document.querySelector('#sound-controller').style.color = "White"
      document.querySelector('#color-switch a').innerHTML = "Black"

  changeBG: ->
    color = document.querySelector('#color-switch a').innerHTML
    if color is "White"
      document.querySelector('body').style.background = "Black"
      document.querySelector('#sound-controller').style.color = "White"
      document.querySelector('#color-switch a').innerHTML = "Black"
    else
      document.querySelector('body').style.background = "White"
      document.querySelector('#sound-controller').style.color = "Black"
      document.querySelector('#color-switch a').innerHTML = "White"