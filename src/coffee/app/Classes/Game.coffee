animFrame = requestAnimationFrame ||
webkitRequestAnimationFrame ||
mozRequestAnimationFrame    ||
oRequestAnimationFrame      ||
msRequestAnimationFrame     ||
null

class Game
  constructor: ->
    @statsInit()
    @scale = 1
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
    @scale = window.innerHeight/config.levelHeight
    stage.setScaleX(@scale)
    stage.setScaleY(@scale)
    stage.draw()
    document.getElementById("container").style.width = config.levelWidth * @scale + "px"
    document.getElementById("chat").style.width = config.levelWidth * @scale + "px"
    document.getElementById("chat").style.margin = "0" + -(config.levelWidth * @scale/2)

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
    imageLoader.addLoad({ name:'cubes', url:'http://res.cloudinary.com/bfo/image/upload/v1388426529/BFO/cubes.jpg'})
    imageLoader.addLoad({ name:'cubes_red', url:'http://res.cloudinary.com/bfo/image/upload/v1388426529/BFO/cubes_red.jpg'})
    imageLoader.addLoad({ name:'cubes_blue', url:'http://res.cloudinary.com/bfo/image/upload/v1388426531/BFO/cubes_blue.jpg'})
    imageLoader.addLoad({ name:'cubes_green', url:'http://res.cloudinary.com/bfo/image/upload/v1388426531/BFO/cubes_green.jpg'})
    imageLoader.addLoad({ name:'cubes_special', url:'http://res.cloudinary.com/bfo/image/upload/v1388496003/BFO/cubes_special.jpg'})
    imageLoader.addLoad({ name:'effects', url:'../assets/effects.png'})
    imageLoader.addLoad({ name:'bonus', url:'http://res.cloudinary.com/bfo/image/upload/v1388426529/BFO/bonus.png'})
    imageLoader.addLoad({ name:'bg', url:'http://res.cloudinary.com/bfo/image/upload/v1388426531/BFO/bg.jpg'})
    imageLoader.addLoad({ name:'boss', url:'http://res.cloudinary.com/bfo/image/upload/v1388434905/BFO/boss.png'})
    imageLoader.addLoad({ name:'playerSpirteSheet', url:'http://res.cloudinary.com/bfo/image/upload/v1388426529/BFO/playerSpirteSheet.png'})
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