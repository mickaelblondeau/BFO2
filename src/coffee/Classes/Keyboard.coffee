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
        keys          : "r",
        on_keydown    : (e) ->
          e.preventDefault()
          game.reset()
      },
      {
        keys          : "space",
        on_keydown    : (e) ->
          e.preventDefault()
          game.launch()
      },
    ]
    keypress.register_many(my_combos)