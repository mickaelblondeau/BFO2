window.onresize = ->
  game.resize()

document.querySelector('#sound-mute-effect').onclick = ->
  if @className is 'muted'
    @className = 'un-muted'
    contentLoader.unmuteEffect()
  else
    @className = 'muted'
    contentLoader.muteEffect()
document.querySelector('#sound-mute-music').onclick = ->
  if @className is 'muted'
    @className = 'un-muted'
    contentLoader.unmuteMusic()
  else
    @className = 'muted'
    contentLoader.muteMusic()

document.querySelector('#sound-add-effect').onclick = ->
  contentLoader.addVolumeEffect()
document.querySelector('#sound-add-music').onclick = ->
  contentLoader.addVolumeMusic()

document.querySelector('#sound-sub-effect').onclick = ->
  contentLoader.lessVolumeEffect()
document.querySelector('#sound-sub-music').onclick = ->
  contentLoader.lessVolumeMusic()

document.querySelector('#music-prev').onclick = ->
  contentLoader.prevSong()
document.querySelector('#music-next').onclick = ->
  contentLoader.nextSong()

document.querySelector('#color-switch').onclick = ->
  contentLoader.changeBG()

document.querySelector('#randomize').onclick = ->
  skinManager.randomizeSkin()

divs = document.querySelectorAll('#skin-control div a')
for div in divs
  div.onclick = (e) ->
    contentLoader.play('beep')
    e.preventDefault()
    elm = document.querySelector('#skin-preview .' + @getAttribute("data-type"))
    tmp = elm.style.background.split('/')
    num = parseInt(tmp[tmp.length-1].split('.png')[0]) + parseInt(@getAttribute("data-add"))
    if num < 1
      num = config.skins[@getAttribute("data-type")]
    else if num > config.skins[@getAttribute("data-type")]
      num = 1
    elm.style.background = 'url("assets/player/'+ @getAttribute("data-type")+'/'+num+'.png") 144px 0'
    skin[@getAttribute("data-type")] = num
    document.querySelector('#skin-control .' + @getAttribute("data-type") + ' .number').innerHTML = num