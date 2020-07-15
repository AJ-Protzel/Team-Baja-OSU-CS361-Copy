/*

HOW TO LOAD THE GAME
tbd


GAMEPLAY

SETUP
Game board is default set as a 4 x 4 grid of tiles.
A player may, at any time, choose a new size for the game board from the dropdown menu. This will reset the game board and score.
The game board color scheme may be changed using the drop down menu.
Score starts at 0.
Game starts with two randomly placed numbers that can either be 2 or 4 (75%/25% chance).

MOVING
To “move”, the player chooses a direction (up, down, left, or right) then all the numbers on the board slide in that direction until they are stopped by the edge of the board or another number.
If a number collides with another number that has an identical value, the two tiles merge and the resulting value is the two numbers added together. The resulting tile cannot merge with another tile again during this move. The score increases by the value on the new tile.
If a move causes three consecutive tiles of the same value to slide together, only the two tiles farthest along the direction of motion will combine. 
If all four spaces in a row or column are filled with tiles of the same value, a move parallel to that row/column will combine the first two and last two.
If a chosen direction would cause no tiles to move, then nothing happens and a different direction must be chosen.
After the move, a number 2 or a number 4 (75%/25% chance) is placed on a random vacant tile.
The player continues to move until the game is over (see below for win and game over conditions).

UNDO
A player may click the undo button in order to reset the game back to a state prior to making the most recent, valid move.
The undo button may not be used more than once before making another valid move.
The number of undo uses are counted and will be displayed with your score at the end of the game. If the player makes the high scoreboard, the undo usage tally will be displayed there as well.

RESET
A player may, at any time, click the reset button to completely restart the game.
Clicking the reset button resets the score and the board.

WINNING
The game is over once the winning tile value is shown on a tile anywhere on the grid.
The game board size dictates the winning tile condition as follows:
3x3 = 1024
4x4 = 2048
5x5 = 4096
6x6 = 8192
7x7 = 16384
8x8 = 32768
9x9 = 65536
10x10 = 131072

GAME OVER
If there are no directions that can be chosen which will cause any tiles to move or merge, the player loses.
The player will have the choice to reset the game board once a game over condition is reached.
*/

![Current Stack](https://i.imgur.com/UYFv9ni.png)
