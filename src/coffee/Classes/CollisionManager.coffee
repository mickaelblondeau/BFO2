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
    return !((a.left > b.right) || (a.right < b.left) || (a.top > b.bottom) || (a.bottom < b.top))

  getSide: (a, b) ->
    margin = 2
    sides =
      top: false
      bot: false
      left: false
      right: false

    if a.bottom <= b.top + b.height/2 and a.left < b.right - margin and a.right > b.left + margin
      sides.top = true
    else if a.top >= b.bottom - b.height/2 and a.left < b.right - margin and a.right > b.left + margin
      sides.bot = true

    if a.left >= b.right - b.width/2 and a.bottom >= b.top + margin
      sides.left = true
    else if a.right <= b.left + b.width/2 and a.bottom >= b.top + margin
      sides.right = true

    return sides