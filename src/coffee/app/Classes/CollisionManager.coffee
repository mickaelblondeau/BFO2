class CollisionManager
  constructor: ->

  getBoundBox: (shape) ->
    return {
      top: shape.getY()
      bottom: shape.getY() + shape.getHeight()
      left: shape.getX()
      right: shape.getX() + shape.getWidth()
    }

  colliding: (a, b) ->
    return !((a.left >= b.right) || (a.right <= b.left) || (a.top >= b.bottom) || (a.bottom <= b.top))

  collidingCorners: (a, b) ->
    return ((b.right >= a.left && b.right < a.right && b.top >= a.top && b.top < a.bottom) or (b.left >= a.left && b.left < a.right && b.top >= a.top && b.top < a.bottom)) and a.top > b.top - 5