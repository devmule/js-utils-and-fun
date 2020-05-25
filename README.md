# js-utils-and-fun
This is a place where i contain my different js stuff
## UTILS
- math
    - Vector
    - Matrix

## FUN

### Conway's Game Of Life
[> run Game Of Life](https://devmule.github.io/js-utils-and-fun/conways-game-of-life/)
- Field in "Game Of Life" is cycled. That means if, for example, size of field is 100 x 100, 
then cell in coordinate (0, 0) is neighbour to cell in coordinate (0, 99).

### Langton's ant
[> run Langton's ant](https://devmule.github.io/js-utils-and-fun/langtons-ant/)
- Field in "Langton's ant" is infinite. Field is made with "tiles". "Tile" is a piece of 2D space,
which contains values of cell in certain coordinates. If cell of certain tile were modified, 
then tile is saving in memory as 2-dimensional array. It allows to make an infinite field, and use 
as little memory as possible.
