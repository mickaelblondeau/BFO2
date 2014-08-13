class Boss
  constructor: (name, timeout, options) ->
    @timeout = timeout
    @name = name
    @options = options

  getLevel: (level, ratio) ->
    if levelManager.level > level
      level + levelManager.level / ratio
    else
      levelManager.level