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

    tmpFrameTime = frameTime

    loop
      if tmpFrameTime <= 50
        interval = tmpFrameTime
        tmpFrameTime = 0
      else
        interval = 50
        tmpFrameTime -= 50
      game.update(interval)
      break if tmpFrameTime == 0

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
    contentLoader.loadImage({ name:'bg', url:'../assets/bg.jpg' })
    contentLoader.loadImage({ name:'boss', url:'../assets/boss.png' })
    contentLoader.loadImage({ name:'playerSpirteSheet', url:'../assets/playerSpirteSheet.png' })
    contentLoader.loadImage({ name:'pidgeon', url:'../assets/pidgeon.png' })

    contentLoader.loadSound({ name:'beep', url:'../assets/sounds/beep.wav', type: 'effect' })
    contentLoader.loadSound({ name:'death', url:'../assets/sounds/death.wav', type: 'effect' })
    contentLoader.loadSound({ name:'explosion', url:'../assets/sounds/explosion.wav', type: 'effect' })
    contentLoader.loadSound({ name:'pickup', url:'../assets/sounds/pickup.wav', type: 'effect' })
    contentLoader.loadSound({ name:'music1', url:'../assets/sounds/music/music.ogg', type: 'music', title: '?' })
    contentLoader.loadSound({ name:'music2', url:'../assets/sounds/music/music2.ogg', type: 'music', title: '?' })
    contentLoader.loadSound({ name:'music3', url:'../assets/sounds/music/music3.ogg', type: 'music', title: 'Rolemusic - Another beek beep beer please' })
    contentLoader.loadSound({ name:'music4', url:'../assets/sounds/music/music4.ogg', type: 'music', title: 'Super Hexagon - Hexagonest Stage' })
    contentLoader.loadSound({ name:'music5', url:'../assets/sounds/music/music5.ogg', type: 'music', title: 'VVVVVV - Pushing Onwards' })
    contentLoader.loadSound({ name:'music6', url:'../assets/sounds/music/music6.ogg', type: 'music', title: 'VVVVVV - Predestined Fate' })

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
      @openHist(9999999999)
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
      timeout = 3000 + message.length * 30
      @openHist(timeout)

  composeHistoric: ->
    document.getElementById('chatHistoric').innerHTML = ""
    for hist, i in @chatHist
      name = @escapeHtml(hist[0])
      message = @escapeHtml(hist[1])
      document.getElementById('chatHistoric').innerHTML += '<div class="message"><span class="from">&#60;'+name+'&#62; </span><span class="content">'+message+'</span></div>'

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