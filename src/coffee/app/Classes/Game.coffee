animFrame = requestAnimationFrame ||
webkitRequestAnimationFrame ||
mozRequestAnimationFrame    ||
oRequestAnimationFrame      ||
msRequestAnimationFrame     ||
null

class Game
  constructor: ->
    @writting = false
    @maxFrameTime = 200
    @stats = new Stats()
    @stats.setMode(0)
    document.body.appendChild( @stats.domElement )
    @chatHist = []
    @chatHistLen = 5

  loop: ->
    @stats.begin()
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    animFrame(Game.prototype.loop.bind(@))
    @lastFrame = thisFrame
    game.update(frameTime)
    @stats.end()

  update: (frameTime) ->

  draw: ->

  start: ->
    document.querySelector('#login').style.display = 'none'
    document.querySelector('#container').style.display = 'block'
    document.querySelector('#container').style.bottom = 0
    document.querySelector('#container').style.position = 'absolute'
    @lastFrame = Date.now()
    @resize()
    @loop()

  resize: ->
    document.querySelector('#container').style.left = (window.innerWidth/2 - config.levelWidth/2) + 'px'
    document.querySelector('#container').style.width = config.levelWidth

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
    contentLoader.loadImage({ name:'bg', url:'../assets/bg_grasslands.png' })
    contentLoader.loadImage({ name:'boss', url:'../assets/boss.png' })
    contentLoader.loadImage({ name:'playerSpirteSheet', url:'../assets/playerSpirteSheet.png' })
    contentLoader.loadImage({ name:'pidgeon', url:'../assets/pidgeon.png' })

    contentLoader.loadSound({ name:'beep', url:'../assets/sounds/beep.wav', type: 'effect' })
    contentLoader.loadSound({ name:'death', url:'../assets/sounds/death.wav', type: 'effect' })
    contentLoader.loadSound({ name:'explosion', url:'../assets/sounds/explosion.wav', type: 'effect' })
    contentLoader.loadSound({ name:'pickup', url:'../assets/sounds/pickup.wav', type: 'effect' })

    contentLoader.loadSound({ name:'music1', url:'../assets/sounds/music/liliantheme.ogg', type: 'music', title: 'Chy - Lilian Theme' })
    contentLoader.loadSound({ name:'music2', url:'../assets/sounds/music/linkotheme.ogg', type: 'music', title: 'Chy - Linko Theme' })
    contentLoader.loadSound({ name:'music3', url:'../assets/sounds/music/chytheme.ogg', type: 'music', title: 'Chy - Chy Theme' })
    contentLoader.loadSound({ name:'music4', url:'../assets/sounds/music/butantheme.ogg', type: 'music', title: 'Chy - Butan Theme' })

    contentLoader.load()

  chat: ->
    if document.activeElement.id is 'chatMessage'
      @writting = false
      if document.activeElement.value isnt undefined and document.activeElement.value.trim() isnt ''
        networkManager.sendMessage(document.getElementById('chatMessage').value)
        if document.getElementById('chatMessage').value[0] isnt '/'
          @addMessage(-1, document.getElementById('chatMessage').value)
      document.getElementById('chatMessage').blur()
      document.getElementById('chatMessage').value = null
      @openHist(3000)
    else
      @writting = true
      @openHist(100000)
      document.getElementById('chatMessage').focus()

  addMessage: (id, message) ->
    contentLoader.play('beep')
    if id is null
      name = 'Server'
    else if id is -1
      name = 'You'
    else
      name = networkManager.players[id].name.getText()
    @chatHist.push([name, message])
    if @chatHist.length > @chatHistLen
      @chatHist.shift()
    @composeHistoric()
    if id isnt -1
      timeout = 5000 + message.length * 30
      @openHist(timeout)

  composeHistoric: ->
    document.getElementById('chatHistoric').innerHTML = ""
    for hist, i in @chatHist
      name = @escapeHtml(hist[0])
      if name is 'Server'
        type = 'server'
      else if name is 'You'
        type = 'you'
      else
        type = 'other'
      message = @escapeHtml(hist[1])
      document.getElementById('chatHistoric').innerHTML += '<div class="message '+type+'"><span class="from">'+name+':</span><span class="content">'+message+'</span></div>'

  escapeHtml: (str) ->
    entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': '&quot;',
      "'": '&#39;',
      "/": '&#x2F;'
    }
    str.replace /[&<>"'\/]/g, (s) ->
      entityMap[s]

  openHist: (time) ->
    if @closeTime isnt undefined
      clearInterval(@closeTime)
    @closeTime = setTimeout(@closeHist, time)
    document.querySelector('#chatHistoric').style.display = 'block'

  closeHist: ->
    document.querySelector('#chatHistoric').style.display = 'none'

  config: ->
    document.querySelector('#login-loading').style.display = 'none'
    document.querySelector('#config').style.display = 'block'