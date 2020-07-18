/*code adapted from https://github.com/amadevBox/2048*/

var canvas = document.getElementById('canvas');
var scoreLabel = document.getElementById('score-container'); // display
var startNew = document.getElementById('start-new'); // button
var setting_button = document.getElementById('settings'); // button
var setting_form = document.getElementById('settings_form'); // page
var scoreButton = document.getElementById('highScores'); // button
var score_form = document.getElementById('highScore_form'); // page
var highScoreBack = document.getElementById('highScoreBack'); // button button

var ctx = canvas.getContext('2d'); // color 2d array
var mainOptions = document.getElementById('mainOptions');
var sizeInput = document.getElementById('size'); // button
var boardSize = 4; // default
var width = canvas.width / boardSize - 6;
var cells = []; // 2d aray to store number values
var fontSize;

var canMove = true; // if game has valid moves
var moveMade = false;
var countFree = boardSize * boardSize; // see if board is full (count == 0; board is full)

var game;
/*
startNew.onclick = function()
{
    boardSize = sizeInput.value;
    width = canvas.width / boardSize - 6;
    canvasClean();
    startGame();
}
*/
startNew.addEventListener('click', function() {startGame(event)});
setting_button.addEventListener('click', function() {showSettings(event)});
scoreButton.addEventListener('click',  function() {showHighscore(event)});

function showSettings(event)
{
  console.log("inside settings function");
  canvas.hidden = true;
  setting_form.hidden = false;
  mainOptions.hidden = true;
  var x = document.createElement("BUTTON");
  var t = document.createTextNode("Save");
  x.appendChild(t);
  setting_form.appendChild(x);
  var current_Node = setting_form.firstElementChild
  var back = setting_form.firstElementChild;
  setting_form.appendChild(document.createElement('form'));
  current_Node = current_Node.nextElementSibling // current_node -> Form

  var i = document.createElement("input"); //board
  i.setAttribute('type',"range");
  i.setAttribute('id',"boardSize");
  i.setAttribute('min', '3');
  i.setAttribute('max', '10');

  var s = document.createElement("label"); //board label
  s.setAttribute('for',"boardsize");
  s.innerText = "Board Size"
  current_Node.appendChild(s);
  current_Node.appendChild(i);
  current_Node.appendChild(document.createElement('br'));

  var i = document.createElement("input"); //input element, text
  i.setAttribute('type',"range");
  i.setAttribute('id',"targetScore");
  i.setAttribute('min', '0');
  i.setAttribute('max', '50');

  var s = document.createElement("label"); //input element, Submit button
  s.setAttribute('for',"targetScore");
  s.innerText = "Target Score"

  current_Node.appendChild(s);
  current_Node.appendChild(i);

  back.onclick = function(){
    setting_form.innerHTML = '';
    setting_form.hidden = true;
    canvas.hidden = false;
    mainOptions.hidden = false;
  };
}

function showHighscore(event)
{
  console.log("inside score function");
  mainOptions.hidden = true;
  canvas.hidden = true;
  score_form.hidden = false;

  highScoreBack.onclick = function()
  {
    score_form.hidden = true;
    canvas.hidden = false;
    mainOptions.hidden = false;
  };
};

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
    this.lastMove = null; // this will track the previous move after a move is made
    this.gameStatus = 'UNFINISHED'; // the game status will be used to identify win states
    this.score = 0; // current game score.
  };
/*
  cell(row, coll)
  { // removed value = null
    //console.log('inside cell');
    this.value = null;
    this.x = coll * width + 5 * (coll + 1);
    this.y = row * width + 5 * (row + 1);
  }

  // adds new null cells to board array
  createCells()
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
*/

canvasClean(can){
  /*
   * Takes current canvas and cleans it up.
   */
  //console.log('inside canvasclean');
  let ctx = can.getContext('2d');
  ctx.clearRect(0, 0, 500, 500);
};

  createBoard(){
    /*
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

  deepCopyBoard(){
    let lastBoard = [];

    for (let i = 0; i < this.size; i++){
      lastBoard[i] = [];
      
      for (let  j = 0; j < this.size; j++){
        //lastBoard[i][j] = new cell(i, j, this.board[i][j].value);
        lastBoard[i][j] = new cell(i, j);
      }
    }
    //console.log(board);
    this.lastMove = lastBoard;
  }

  drawCell(cell, canvas){
    /*
     * Takes in individual cell object and current canvas and draws cell onto canvas
     */
    //console.log(cell);
    //console.log(canvas);
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    ctx.fillStyle = this.cellColor(cell.value);
    ctx.fill();
    if(cell.value){
      fontSize = width / 2.5;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
    }
  };

  cellColor(val){
    switch (val){
      case null : return '#A9A9A9'; break;
      case 2 : 
        return '#D2691E'; 
      case 4 :
        return '#FF7F50';
      case 8 : 
        return '#ffbf00';
      case 16 : 
        return '#bfff00';
      case 32 : 
        return '#40ff00';
      case 64 : 
        return '#00bfff'; 
      case 128 : 
        return '#FF7F50';
      case 256 : 
        return '#0040ff'; 
      case 512 : 
        return '#ff0080';
      case 1024 : 
        return '#D2691E';
      case 2048 : 
        return '#FF7F50';
      case 4096 : 
        return '#ffbf00';
    }
  };

  drawAllCells(can){
    //console.log('inside draw all');
    for (let i = 0; i < this.size; i++){
      for (let j = 0; j < this.size; j++){
        this.drawCell(this.board[i][j], can);
      }
    }
  };
  
  addRandomcell(can){
    /**
     * class function adds random cell to existing game board in an empty space
     */
    //console.log('inside addRandom');
    //while(true){

    //var looked = [];
    while(true){
      //console.log('looking for null');
    //while(countFree >= 1){
      var row = Math.floor(Math.random() * boardSize);
      var coll = Math.floor(Math.random() * boardSize);
      if (this.board[row][coll].value == null){
        
        if (Math.ceil(Math.random()*99 > 79)){ // adds 20% chance to start with 4{ 
          this.board[row][coll].value = 4;
        }
        else
        {
          this.board[row][coll].value = 2;
        }
        return;
      }
      //else{
      //  looked.push(row, coll);
      //}
    }
  };
  
  moveUp(){
    /*
    for (let colX = 0; colX < this.size; colX++)
    {
      var curValOrdered = [];
      for (let rowY = this.size -1; rowY >= 0; rowY--){
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value != null){
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0){
        for (let y = 0; y < this.size; y++){
          if (curValOrdered != 0){
            this.board[y][colX].value = curValOrdered.pop();
          } else {
            this.board[y][colX].value = null;
          }
        }
      }
    }
    */

   var rowY, colX, cur;
   for(colX = 0; colX < boardSize; colX++)
   {
     for(rowY = 1; rowY < boardSize; rowY++)
     {
       if(this.board[rowY][colX].value)
       {
         cur = rowY;
         while (cur > 0)
         {
           if(!this.board[cur - 1][colX].value)
           {
             this.board[cur - 1][colX].value = this.board[cur][colX].value;
             this.board[cur][colX].value = 0;
             cur--;
             moveMade = true;
           }  
           else 
           {
             break; 
           }
         }
       }
     }
   }
  };

  addUp(){
    for (let colX = 0; colX < this.size; ++colX)
    {
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      {
        if (this.board[rowY][colX].value != null){
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
    //this.addRandomcell(canvas);
  };

  moveDown(){
    /*
    for (let colX = 0; colX < this.size; colX++)
    {
      var curValOrdered = [];
      for (let rowY = 0; rowY < this.size; rowY++){
        if (this.board[rowY][colX].value != null){
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0){
        for (let y = this.size -1; y >= 0; y--){
          if (curValOrdered != 0){
            this.board[y][colX].value = curValOrdered.pop();
          } else {
            this.board[y][colX].value = null;
          }
        }
      }
    }
    */

   var rowY, colX, row;
   for(colX = 0; colX < boardSize; colX++)
   {
     for(rowY = boardSize - 2; rowY >= 0; rowY--)
     {
       if(this.doard[rowY][colX].value)
       {
         cur = rowY;
         while (cur + 1 < boardSize)
         {
           if (!this.doard[cur + 1][colX].value)
           {
             this.doard[cur + 1][colX].value = this.doard[cur][colX].value;
             this.doard[cur][colX].value = 0;
             cur++;
             moveMade = true;
           }  
           else
           {
             break; 
           }
         }
       }
     }
   }
  };

  addDown(){
    for (let colX = 0; colX < this.size; ++colX)
    {
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      {
        if (this.board[rowY][colX].value != null){
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
    //this.addRandomcell(canvas);
  };

  moveLeft(){
    /*
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = this.size -1; colX >= 0; colX--){
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value != null){
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0){
        for (let x = 0; x < this.size; x++){
          if (curValOrdered != 0){
            this.board[rowY][x].value = curValOrdered.pop();
          } else {
            this.board[rowY][x].value = null;
          }
        }
      }
    }
    */

   var rowY, colX, cur;
   for(rowY = 0; rowY < boardSize; rowY++)
   {
     for(colX = 1; colX < boardSize; colX++)
     {
       if(this.board[rowY][colX].value)
       {
         cur = colX;
         while (cur - 1 >= 0){
           if (!this.board[rowY][cur - 1].value)
           {
             this.board[rowY][cur - 1].value = this.board[rowY][cur].value;
             this.board[rowY][cur].value = 0;
             cur--;
             moveMade = true;
           } 
           else 
           {
             break; 
           }
         }
       }
     }
   }
  };

  addLeft(){
    for (let rowY = 0; rowY < this.size; ++rowY)
    {
      for (let colX = this.size - 2; colX >= 0; --colX)
      {
        if (this.board[rowY][colX].value != null){
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
    //this.addRandomcell(canvas);
  };

  moveRight(){
    /*
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = 0; colX < this.size; colX++){
        //console.log(this.board[rowY][colX]);
        if (this.board[rowY][colX].value){
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if (curValOrdered.length > 0){
        for (let x = this.size - 1; x >= 0; x--){
          if (curValOrdered != 0){
            this.board[rowY][x].value = curValOrdered.pop();
          } else {
            this.board[rowY][x].value = null;
          }
        }
      }
    }
    */

  var rowY, colX, cur;
  for(rowY = 0; rowY < boardSize; ++rowY)
  {
    for(colX = boardSize - 2; colX >= 0; --colX)
    {
      if(this.board[rowY][colX].value)
      {
        cur = colX;
        while(cur + 1 < boardSize)
        {
          if(!this.board[rowY][cur + 1].value)
          {
            this.board[rowY][cur + 1].value = this.board[rowY][cur].value;
            this.board[rowY][cur].value = 0;
            cur++;
            moveMade = true;
          }
          else
          {
            break;
          }
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
        if (this.board[rowY][colX].value != null){
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
    //this.addRandomcell(canvas);
  };

  checkStatus(){
    /* traverses the game board to find out current game status
     * possible options
     * WIN: There contains a board pieces that hits the target score
     * LOSE: The board has no empty spaces
     * UNFINISHED: Not one of the 2 statuses above.
     */
    //TODO: Not finished. How to handle if there is still a possible move?
    let empty_flag = false; // looks for 
    for (let i = 0; i < this.size; i++){
      for (let j = 0; j < this.size; j++){
        if (this.board[i][j].value == this.target){
          return 'WIN'
        }
        else if (this.board[i][j].value == null){
          empty_flag = true;
        }
      }
    }
    if(empty_flag == false)
    {
      return 'LOSE'; // add move checher function <-- TODO
    } 
    else
    {
      return 'UNFINISHED';
    }
  };
};

// sets inital cells as null
function cell(row, coll)
{ // removed value = null
  //console.log('inside cell');
  this.value = null;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

// adds new null cells to board array
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

// button inputs listener
document.onkeyup = function(event) // arrow key or wasd
{
  game.deepCopyBoard(); // copies board before move made
  console.log('called');
  moveMade = false;

  if(canMove)
  {
    if(event.keyCode === 38 || event.keyCode === 87) // Up
    {
      game.moveUp();
      game.addUp();
    }
    else if(event.keyCode === 39 || event.keyCode === 68) // Right
    {
      game.moveRight();
      game.addRight();
    }
    else if(event.keyCode === 40 || event.keyCode === 83) // Down
    {
      game.moveDown(); 
      game.addDown();
    }
    else if(event.keyCode === 37 || event.keyCode === 65) // Left
    {
      game.moveLeft(); 
      game.addLeft();
    }
  }

  if (moveMade == true) // adds new random value
  {
    game.addRandomcell(canvas);
  } 
  
  game.drawAllCells(canvas); // redraws all cells after move

  scoreLabel.innerHTML = 'Score : ' + game.score; // add score after move
  game.gameStatus = game.checkStatus();
  if (this.gameStatus != 'UNFINISHED')
  {
    // DO SOMETHING WITH WIN AND LOSE CONDITION
    //console.log(this.gameStatus);
  }




  /*
  if (!loss) // if board is full but there is a move option, allow input
  {
    moveMade = false;
    if (event.keyCode === 38 || event.keyCode === 87)
    /////////////////////////////
    }

    scoreLabel.innerHTML = 'Score : ' + score; // add score after move

    countFreeCells(); // check if board is full, return t/f
    if(countFree == 0)
    {
      checkGameLoss(); // end game if returned lose == true
	  }
  }
  */
};

// start new game / reset bgame and board
function startGame()
{
  console.log("Start game");
  canvas.style.opacity = '1.0';
  canMove = true;
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  let currentGame = new game2048(boardSize);
  //console.log(currentGame);
  currentGame.canvasClean(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.drawAllCells(canvas);
  //score = 0;
  scoreLabel.innerHTML = 'Score : ' + currentGame.score;
  game = currentGame;
  //game.deepCopyBoard();
}

startGame();
