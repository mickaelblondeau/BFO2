class HomingManPart extends Boss
  constructor: (x, y, pattern) ->
    super('phantom', x, y, 32, 32)
    @pattern = pattern
    @index = 0
    @position = false
    @ready = true

  wait: ->
    if @pattern[@index] isnt undefined
      self = @
      fn = ->
        self.ready = true
      setTimeout(fn, @pattern[@index][1])