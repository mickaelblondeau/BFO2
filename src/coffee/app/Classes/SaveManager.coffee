class SaveManager
  saveOptions: ->
    localStorage.setItem('player_name', document.querySelector('#name').value)
    localStorage.setItem('player_skin', skinManager.getSkin('skin'))
    localStorage.setItem('player_hair', skinManager.getSkin('hair'))
    localStorage.setItem('player_head', skinManager.getSkin('head'))
    localStorage.setItem('player_body', skinManager.getSkin('body'))
    localStorage.setItem('player_leg', skinManager.getSkin('leg'))
    localStorage.setItem('player_shoes', skinManager.getSkin('shoes'))
    localStorage.setItem('volume_effect', document.querySelector('#sound-effect').innerHTML)
    localStorage.setItem('volume_music', document.querySelector('#sound-music').innerHTML)
    localStorage.setItem('bg_color', document.querySelector('#color-switch a').innerHTML)

  loadOptions: ->
    document.querySelector('#name').value = localStorage.getItem('player_name')
    skinManager.setSkin('skin', localStorage.getItem('player_skin') || 1)
    skinManager.setSkin('hair', localStorage.getItem('player_hair') || 1)
    skinManager.setSkin('head', localStorage.getItem('player_head') || 1)
    skinManager.setSkin('body', localStorage.getItem('player_body') || 1)
    skinManager.setSkin('leg', localStorage.getItem('player_leg') || 1)
    skinManager.setSkin('shoes', localStorage.getItem('player_shoes') || 1)
    contentLoader.setEffectVolume(localStorage.getItem('volume_effect') || 10)
    contentLoader.setMusicVolume(localStorage.getItem('volume_music') || 10)
    contentLoader.setBG(localStorage.getItem('bg_color') || "White")