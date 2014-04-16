class Keyboard
  constructor: ->
    @defineEvents()
    @keys = {
      left: false
      right: false
      up: false
      down: false
    }

  defineEvents: ->
    my_combos = [
      {
        keys          : "left",
        on_keydown    : (e) ->
          e.preventDefault()
          keyboard.keys.left = true
        on_release    : ->
          keyboard.keys.left = false
      },
      {
        keys          : "right",
        on_keydown    : (e) ->
          e.preventDefault()
          keyboard.keys.right = true
        on_release    : ->
          keyboard.keys.right = false
      },
      {
        keys          : "down",
        on_keydown    : (e) ->
          e.preventDefault()
          keyboard.keys.down = true
        on_release    : ->
          keyboard.keys.down = false
      },
      {
        keys          : "up",
        on_keydown    : (e) ->
          e.preventDefault()
          keyboard.keys.up = true
        on_release    : ->
          keyboard.keys.up = false
      },
      {
        keys          : "enter",
        on_keydown    : ->
          game.chat()
      },
      {
        keys          : "t",
        on_keydown    : ->
          if !game.writting
            if player isnt undefined
              player.useTp()
      },
      {
        keys          : "y",
        on_keydown    : ->
          if !game.writting
            if player isnt undefined
              player.use()
      },
    ]
    keypress.register_many(my_combos)