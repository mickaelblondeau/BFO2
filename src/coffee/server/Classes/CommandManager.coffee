class CommandManager
  constructor: ->
    @allowedCommands = [
      {
        cmd: ['difficulty', 'diff']
        params: 0
        exec: 'commandManager.help("difficulty")'
      }
      {
        cmd: ['difficulty', 'diff']
        params: 1
        type: 'str'
        exec: 'levelManager.setDifficulty'
      }
    ]

  exec: (socket, cmd) ->
    cmd = cmd.split('/')[1]
    obj = @exist(cmd)
    if obj and @isAdmin(socket)
      msg = @execFunction(obj, cmd)
      if msg
        socket.emit 'message', [null, msg]
    else
      socket.emit 'message', [null, 'Command not found !']

  exist: (cmd) ->
    tmp = cmd.split(' ')
    cmd = tmp[0]
    params = tmp.length - 1
    for command in @allowedCommands
      for alias in command.cmd
        if alias is cmd and command.params is params
          return command
    return false

  isAdmin: (socket) ->
    return socket.id is networkManager.io.sockets.clients()[0].id

  execFunction: (cmd, params) ->
    params = params.split(' ')
    if cmd.params is 0 and cmd.exec isnt undefined
      return eval(cmd.exec)
    else if cmd.exec isnt undefined
      p = ''
      for i in [1..cmd.params]
        p += @sanitizeParameter(params[i], cmd.type) + ','
      p = p.substr(0,p.length-1)
      return eval(cmd.exec + '(' + p + ')')
    else
      return 'Command unknown'

  sanitizeParameter: (param, rule) ->
    if rule is 'bool'
      return param is 'true'
    else if rule is 'int'
      return parseInt(param)
    else
      return '"' + param + '"'

  help: (cmd) ->
    if cmd is 'difficulty'
      'Command usage : /difficulty easy|medium|hard|hell'
    else
      'Command unknown'