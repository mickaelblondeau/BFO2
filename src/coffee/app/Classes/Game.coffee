animFrame = requestAnimationFrame ||
webkitRequestAnimationFrame ||
mozRequestAnimationFrame    ||
oRequestAnimationFrame      ||
msRequestAnimationFrame     ||
null

class Game
  constructor: ->
    @statsInit()
    @writting = false
    @maxFrameTime = 200

  loop: ->
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    animFrame(Game.prototype.loop.bind(@))
    @lastFrame = thisFrame

    game.statsBegin()

    while(frameTime > @maxFrameTime)
      frameTime -= @maxFrameTime
      game.update(@maxFrameTime)
    game.update(frameTime)

    game.statsEnd()

  update: (frameTime) ->

  start: ->
    @lastFrame = Date.now()
    @resize()
    @loop()

  resize: ->
    document.getElementById("container").style.margin = "-"+(config.levelHeight-window.innerHeight)+" auto"
    document.getElementById("container").style.width = config.levelWidth

  statsInit: ->
    @fps = new Stats()
    document.body.appendChild( @fps.domElement )

  statsBegin: ->
    @fps.begin()

  statsEnd: ->
    @fps.end()

  reset: ->
    if networkManager.socket isnt undefined
      networkManager.sendReset()

  launch: ->
    if networkManager.socket isnt undefined
      networkManager.sendLaunch()

  loadAssets: ->
    contentLoader.loadImage({ name:'cubes', url:'../assets/cubes.jpg' })
    contentLoader.loadImage({ name:'cubes_red', url:'../assets/cubes_red.jpg' })
    contentLoader.loadImage({ name:'cubes_blue', url:'../assets/cubes_blue.jpg' })
    contentLoader.loadImage({ name:'cubes_green', url:'../assets/cubes_green.jpg' })
    contentLoader.loadImage({ name:'cubes_special', url:'../assets/cubes_special.jpg' })
    contentLoader.loadImage({ name:'effects', url:'../assets/effects.png' })
    contentLoader.loadImage({ name:'bonus', url:'../assets/bonus.png' })
    contentLoader.loadImage({ name:'bg', url:'../assets/bg.jpg' })
    contentLoader.loadImage({ name:'boss', url:'../assets/boss.png' })
    contentLoader.loadImage({ name:'playerSpirteSheet', url:'../assets/playerSpirteSheet.png' })

    contentLoader.loadSound({ name:'beep', url:'../assets/sounds/beep.wav', type: 'effect' })
    contentLoader.loadSound({ name:'death', url:'../assets/sounds/death.wav', type: 'effect' })
    contentLoader.loadSound({ name:'explosion', url:'../assets/sounds/explosion.wav', type: 'effect' })
    contentLoader.loadSound({ name:'pickup', url:'../assets/sounds/pickup.wav', type: 'effect' })
    contentLoader.loadSound({ name:'music1', url:'../assets/sounds/music/music.ogg', type: 'music' })
    contentLoader.loadSound({ name:'music2', url:'../assets/sounds/music/music2.ogg', type: 'music' })
    contentLoader.loadSound({ name:'music3', url:'../assets/sounds/music/music3.ogg', type: 'music' })

    contentLoader.load()

  chat: ->
    if document.activeElement.id is 'chatMessage'
      @writting = false
      if document.activeElement.value isnt undefined and document.activeElement.value.trim() isnt ''
        networkManager.sendMessage(document.getElementById('chatMessage').value)
        @addMessage('Me', document.getElementById('chatMessage').value)
      document.getElementById('chatMessage').blur()
      document.getElementById('chatMessage').value = null
    else
      @writting = true
      document.getElementById('chatMessage').focus()

  addMessage: (name, message) ->
    contentLoader.play('beep')
    document.getElementById('chatMessages').innerHTML += '<div class="message"><span class="from">'+name+'</span> : <span class="content">'+message+'</span></div>'
    callback = ->
      document.querySelectorAll('#chatMessages .message')[0].remove()
    setTimeout(callback, 3000)