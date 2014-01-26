window.onresize = ->
  game.resize()

document.getElementById('sound-mute').onclick = ->
  contentLoader.muteVolume()

document.getElementById('sound-add').onclick = ->
  contentLoader.addVolume()

document.getElementById('sound-sub').onclick = ->
  contentLoader.lessVolume()