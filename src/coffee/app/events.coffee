window.onresize = ->
  game.resize()

document.querySelector('#sound-mute').onclick = ->
  contentLoader.muteVolume()

document.querySelector('#sound-add').onclick = ->
  contentLoader.addVolume()

document.querySelector('#sound-sub').onclick = ->
  contentLoader.lessVolume()

divs = document.querySelectorAll('#skin-control div a')
for div in divs
  div.onclick = (e) ->
    contentLoader.play('beep')
    e.preventDefault()
    elm = document.querySelector('#skin-preview .' + @getAttribute("data-type"))
    if elm.style.background is ""
      num = 2
    else
      num = parseInt(elm.style.background.split('/')[4].split('.png')[0]) + parseInt(@getAttribute("data-add"))
    if num < 1
      num = config.skins[@getAttribute("data-type")]
    else if num > config.skins[@getAttribute("data-type")]
      num = 1
    elm.style.background = 'url("../assets/player/'+ @getAttribute("data-type")+'/'+num+'.png") 140px 0'
    skin[@getAttribute("data-type")] = num