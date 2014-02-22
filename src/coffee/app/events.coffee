window.onresize = ->
  game.resize()

document.querySelector('#sound-mute-effect').onclick = ->
  @className = 'muted'
  contentLoader.muteEffect()
document.querySelector('#sound-mute-music').onclick = ->
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

divs = document.querySelectorAll('#skin-control div a')
for div in divs
  div.onclick = (e) ->
    contentLoader.play('beep')
    e.preventDefault()
    elm = document.querySelector('#skin-preview .' + @getAttribute("data-type"))
    if elm.style.background is "" and elm.style.backgroundImage is ""
      num = 2
    else if elm.style.backgroundImage isnt ""
      num = parseInt(elm.style.backgroundImage.split('/')[6].split('.png')[0]) + parseInt(@getAttribute("data-add"))
    else
      num = parseInt(elm.style.background.split('/')[4].split('.png')[0]) + parseInt(@getAttribute("data-add"))
    if num < 1
      num = config.skins[@getAttribute("data-type")]
    else if num > config.skins[@getAttribute("data-type")]
      num = 1
    elm.style.background = 'url("../assets/player/'+ @getAttribute("data-type")+'/'+num+'.png") 140px 0'
    skin[@getAttribute("data-type")] = num
    document.querySelector('#skin-control .' + @getAttribute("data-type") + ' .number').innerHTML = num