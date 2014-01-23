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

  loop: ->
    thisFrame = Date.now()
    frameTime = thisFrame - @lastFrame
    animFrame(Game.prototype.loop.bind(@))
    @lastFrame = thisFrame

    game.statsBegin()
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
    imageLoader.addLoad({ name:'cubes', url:'../assets/cubes.jpg'})
    imageLoader.addLoad({ name:'cubes_red', url:'../assets/cubes_red.jpg'})
    imageLoader.addLoad({ name:'cubes_blue', url:'../assets/cubes_blue.jpg'})
    imageLoader.addLoad({ name:'cubes_green', url:'../assets/cubes_green.jpg'})
    imageLoader.addLoad({ name:'cubes_special', url:'../assets/cubes_special.jpg'})
    imageLoader.addLoad({ name:'effects', url:'../assets/effects.png'})
    imageLoader.addLoad({ name:'bonus', url:'../assets/bonus.png'})
    imageLoader.addLoad({ name:'bg', url:'../assets/bg.jpg'})
    imageLoader.addLoad({ name:'boss', url:'../assets/boss.png'})
    imageLoader.addLoad({ name:'playerSpirteSheet', url:'../assets/playerSpirteSheet.png'})
    imageLoader.load()

  chat: ->
    if document.activeElement.id is 'chatMessage'
      @writting = false
      if document.activeElement.value isnt undefined and document.activeElement.value isnt ''
        networkManager.sendMessage(document.getElementById('chatMessage').value)
        @addMessage('Me', document.getElementById('chatMessage').value)
      document.getElementById('chatMessage').blur()
      document.getElementById('chatMessage').value = null
    else
      @writting = true
      document.getElementById('chatMessage').focus()

  addMessage: (name, message) ->
    document.getElementById('chatMessages').innerHTML += '<div class="message"><span class="from">'+name+'</span> : <span class="content">'+message+'</span></div>'
    callback = ->
      document.querySelectorAll('#chatMessages .message')[0].remove()
    setTimeout(callback, 3000)