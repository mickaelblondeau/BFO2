class CollisionManager
  constructor: ->

  getBoundBox: (shape) ->
    return {
      top: shape.getY()
      bottom: shape.getY() + shape.getHeight()
      left: shape.getX()
      right: shape.getX() + shape.getWidth()
      x: shape.getX() + shape.getWidth()/2
      y: shape.getY() + shape.getHeight()/2
      width: shape.getWidth()
      height: shape.getHeight()
    }

  colliding: (a, b) ->
    return (Math.abs(a.x - b.x) * 2 <= (a.width + b.width)) and (Math.abs(a.y - b.y) * 2 <= (a.height + b.height))

  getSide: (a, b) ->
    margin = b.height / 2
    sides =
      top: false
      bot: false
      left: false
      right: false
    if a.bottom >= b.top and a.bottom <= b.top + margin and a.left < b.right - 1 and a.right > b.left + 1
      sides.top = true
    else if a.top <= b.bottom and a.top >= b.bottom - margin and a.left < b.right - 1 and a.right > b.left + 1
      sides.bot = true

    if a.left <= b.right and a.left >= b.right - margin and a.bottom >= b.top + 1
      sides.left = true
    else if a.right >= b.left and a.right <= b.left + margin and a.bottom >= b.top + 1
      sides.right = true

    return sides