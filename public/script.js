/*code adapted from https://github.com/amadevBox/2048*/

var canvas = document.getElementById('canvas'); //background square
var ctx = canvas.getContext('2d');
var sizeInput = document.getElementById('size'); // button
var changeSize = document.getElementById('change-size'); // button
var scoreLabel = document.getElementById('score-container'); // display
var score = 0;
var boardSize = 4; // default
var width = canvas.width / boardSize - 6; //-6 moves cell image to center
var cells = [];
var fontSize;
var loss = false;
var movementMade = true;
var countFree;
var game;



class game2048{
  /**
   * 
   * @param {*} size 
   * @param {*} target 
   * 
   * This class will cont
   */
  constructor (size=4, target= 2048){
    /**
     * The constructor for game2048 (default params included)
     * ex game = new game2048(3, 1024) => creates a 3x3 board where 1024 is the win score
     */
    this.size = size; // size of board
    this.target = target; // score for win
    this.removeSquare = false; // this flag signals if the user has used their removed square option during the game
    this.board = this.createBoard(); // creates an empty board of cells
    this.lastMove = null; // this will tract the previous move after a move is made
    this.gameStatus = 'UNFINISHED'; // the game status will be used to identify win states
    this.score = 0; // current game score.
  };

  createBoard()
  {
    /**
     * This function will create an array representation of the initized game board.
     * To create the board, it will take in the size passed into the function.
     * Return empty array board of empty cell objects.
     */

    let board = [];

    for (let i = 0; i < this.size; i++){
      board[i] = [];
      
      for (let  j = 0; j < this.size; j++){
        board[i][j] = new cell(i,j);
      }
    }
    //console.log(board);
    return board;
  };

  deepCopyBoard()
  {
    let lastboard = [];

    for (let i = 0; i < this.size; i++)
    {
      lastboard[i] = [];
      
      for (let  j = 0; j < this.size; j++)
      {
        lastboard[i][j] = new cell(i,j,this.board[i][j].value);
      }
    }
    //console.log(board);
    this.lastMove = lastboard;
  }

  drawCell(cell, canvas)
  {
    /**
     * Takes in individual cell object and current canvas and draws cell onto canvas
     */
    //console.log(cell);
    //console.log(canvas);
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    ctx.fillStyle =  this.cellColor(cell.value);
    ctx.fill();
    if (cell.value){
      fontSize = width / 2.5;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
    }
  };

  cellColor(val)
  {
    switch (val)
    {
      case null : return '#A9A9A9'; break;
      case 2 : 
        return '#D2691E'; 
      case 4 :
        return'#FF7F50';
      case 8 : 
        return'#ffbf00';
      case 16 : 
        return'#bfff00';
      case 32 : 
        return'#40ff00';
      case 64 : 
        return'#00bfff'; 
      case 128 : 
        return'#FF7F50';
      case 256 : 
        return'#0040ff'; 
      case 512 : 
        return'#ff0080';
      case 1024 : 
        return'#D2691E';
      case 2048 : 
        return'#FF7F50';
      case 4096 : 
        return'#ffbf00';
    }
  };
  
  canvasClean(can)
  {
    /**
     * Takes current canvas and cleans it up.
     */
    //console.log('inside canvasclean');
    let ctx = can.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
  };

  drawAllCells(can)
  {
    //console.log('inside draw all');
    for (let i = 0; i < this.size; i++)
    {
      for (let j = 0; j < this.size; j++)
      {
        this.drawCell(this.board[i][j], can);
      }
    }
  };
  
  addRandomcell(can)
  {
    /**
     * class function adds random cell to existing game board in an empty space
     */
    //console.log('inside addRandom');
    while(true)
    {
      var row = Math.floor(Math.random() * boardSize);
      var coll = Math.floor(Math.random() * boardSize);
      if (this.board[row][coll].value == null)
      {        
        if (Math.ceil(Math.random()*99 > 79))// adds 20% chance to start with 4{ 
        { 
          this.board[row][coll].value = 4;
        }
        else
        {
          this.board[row][coll].value = 2;
        }
        return;
      }
    }
  };
  
  moveRight()
  {
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = 0; colX < this.size; colX++)
      {
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0)
      {
        for (let x = this.size -1; x >= 0; x--)
        {
          if (curValOrdered != 0)
          {
            this.board[rowY][x].value = curValOrdered.pop();
          } 
          else 
          {
            this.board[rowY][x].value = null;
          }
        }

      }
    }
  };

  addRight(){
    for (let rowY = 0; rowY < this.size; ++rowY)
    {
      for (let colX = this.size - 2; colX >= 0; --colX)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = colX;
          if (this.board[rowY][cur].value == this.board[rowY][cur + 1].value)
          {
            this.score  += this.board[rowY][cur + 1].value *2;
            this.board[rowY][cur + 1].value *= 2;
            this.board[rowY][cur].value = null;          
          }
        }
      }
    }
    this.moveRight();
    this.addRandomcell(canvas);
  };

  moveLeft()
  {
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = this.size -1; colX >= 0; colX--)
      {
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0)
      {
        for (let x = 0; x < this.size; x++)
        {
          if (curValOrdered != 0)
          {
            this.board[rowY][x].value = curValOrdered.pop();
          } 
          else 
          {
            this.board[rowY][x].value = null;
          }
        }
      }
    }
  };

  addLeft()
  {
    for (let rowY = 0; rowY < this.size; ++rowY)
    {
      for (let colX = this.size - 2; colX >= 0; --colX)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = colX;
          if (this.board[rowY][cur].value == this.board[rowY][cur + 1].value)
          {
            this.score  += this.board[rowY][cur + 1].value *2;
            this.board[rowY][cur + 1].value *= 2;
            this.board[rowY][cur].value = null;            
          }
        }
      }
    }
    this.moveLeft();
    this.addRandomcell(canvas);
  };

  moveUp()
  {
    for (let colX = 0; colX < this.size; colX++)
    {
      var curValOrdered = [];
      for (let rowY = this.size -1; rowY >= 0; rowY--)
      {
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0)
      {
        for (let y = 0; y < this.size; y++)
        {
          if (curValOrdered != 0)
          {
            this.board[y][colX].value = curValOrdered.pop();
          } 
          else 
          {
            this.board[y][colX].value = null;
          }
        }
      }
    }
  };

  addUp()
  {
    for (let colX = 0; colX < this.size; ++colX)
    {
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = rowY;
          if (this.board[cur][colX].value == this.board[cur+1][colX].value)
          {
            this.score += this.board[cur][colX].value *2;
            this.board[cur][colX].value *= 2;
            this.board[cur+1][colX].value = null;       
          }
        }
      }
    }
    this.moveUp();
    this.addRandomcell(canvas);
  };

  moveDown()
  {
    for (let colX = 0; colX < this.size; colX++)
    {
      var curValOrdered = [];
      for (let rowY = 0; rowY < this.size; rowY++)
      {
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0)
      {
        for (let y = this.size -1; y >= 0; y--)
        {
          if (curValOrdered != 0)
          {
            this.board[y][colX].value = curValOrdered.pop();
          } 
          else 
          {
            this.board[y][colX].value = null;
          }
        }
      }
    }
  };

  addDown()
  {
    for (let colX = 0; colX < this.size; ++colX)
    {
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = rowY;
          if (this.board[cur][colX].value == this.board[cur+1][colX].value)
          {
            this.score += this.board[cur][colX].value *2;
            this.board[cur][colX].value *= 2;
            this.board[cur+1][colX].value = null;            
          }
        }
      }
    }
    this.moveDown();
    this.addRandomcell(canvas);
  };

  checkStatus()
  {
    /** traverses the game board to find out current game status
     * possible options
     * WIN: There contains a board pieces that hits the target score
     * LOSE: The board has no empty spaces
     * UNFINISHED: Not one of the 2 statuses above.
     */
    //TODO: Not finished. How to handle if there is still a possible move?
    let empty_flag = false; // looks for 
    for (let i = 0; i < this.size; i++)
    {
      for (let j = 0; j < this.size; j++)
      {     
        if (this.board[i][j].value == this.target)
        {
          return 'WIN'
        }
        if (this.board[i][j].value == null)
        {
          empty_flag  = true;
        }
      }
    }
    if (empty_flag == false)
    {
      return 'LOSE';
    } 
    else
    {
      return 'UNFINISHED';
    }
  };
};


// sets new cell where value is either a number OR null if empty;
function cell(row, coll , value=null){
  //console.log('inside cell');
  this.value = value;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

// adds new 0 cells to board
function createCells()
{
  var i, j;
  for (i = 0; i < boardSize; i++)
  {
    cells[i] = [];
    for (j = 0; j < boardSize; j++)
    {
      cells[i][j] = new cell(i, j);
    }
  }
}

// sets colors to cells based on number
function drawCell(cell)
{
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);

  switch (cell.value)
  {
    case 0 : ctx.fillStyle = '#A9A9A9'; break;
    case 2 : ctx.fillStyle = '#D2691E'; break;
    case 4 : ctx.fillStyle = '#FF7F50'; break;
    case 8 : ctx.fillStyle = '#ffbf00'; break;
    case 16 : ctx.fillStyle = '#bfff00'; break;
    case 32 : ctx.fillStyle = '#40ff00'; break;
    case 64 : ctx.fillStyle = '#00bfff'; break;
    case 128 : ctx.fillStyle = '#FF7F50'; break;
    case 256 : ctx.fillStyle = '#0040ff'; break;
    case 512 : ctx.fillStyle = '#ff0080'; break;
    case 1024 : ctx.fillStyle = '#D2691E'; break;
    case 2048 : ctx.fillStyle = '#FF7F50'; break;
    case 4096 : ctx.fillStyle = '#ffbf00'; break;
    default : ctx.fillStyle = '#ff0080';
  }

  ctx.fill();
  if (cell.value)
  {
    fontSize = width / 2.5;
    ctx.font = fontSize + 'px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
  }
}

// removes cells colors
function canvasClean()
{
  ctx.clearRect(0, 0, 500, 500);
}

// button inputs listener
document.onkeyup = function(event)
{
    if (event.keyCode === 38 || event.keyCode === 87) //upward move
    {
      console.log('Pre-move');
      console.log(game.board);
      game.deepCopyBoard();
      game.moveUp();
      game.addUp();
      console.log('post-move')
      console.log(game.board);
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 39 || event.keyCode === 68 //right move
    {
      game.deepCopyBoard();
      game.moveRight();
      game.addRight();
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 40 || event.keyCode === 83) //downawrd move
    {
      game.deepCopyBoard();
      game.moveDown(); 
      game.addDown();
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 37 || event.keyCode === 65) //left move
    {
      game.deepCopyBoard();
      game.moveLeft(); 
      game.addLeft();
      game.drawAllCells(canvas);
    }

    scoreLabel.innerHTML = 'Score : ' + game.score; // add score after move
    game.gameStatus = game.checkStatus();
    if (this.gameStatus != 'UNFINISHED')
    {
      // DO SOMETHING WITH WIN AND LOSE CONDITION
      console.log(this.gameStatus);
    }
};


// start new game / reset game and board
function startGame()
{
  console.log("Start game");
  canvas.style.opacity = '1.0'; //reset board opacity to normal
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  let currentGame = new game2048(boardSize);
  console.log(currentGame);
  currentGame.canvasClean(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.drawAllCells(canvas);
  scoreLabel.innerHTML = 'Score : ' + currentGame.score;
  game = currentGame;
}

startGame();


// Start New Game button press
changeSize.onclick = function()
{
  startGame();
}


