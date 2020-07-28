/*code adapted from https://github.com/amadevBox/2048*/

var scoreLabel = document.getElementById('score-container'); // display
var mainOptions = document.getElementById('mainOptions'); // box that holds buttons
var sizeInput = document.getElementById('size'); // button // in setting page
var boardSize = sizeInput.value; // sets boardSize equal to user input board size // ?class? // in setting page
var startNew = document.getElementById('start-new'); // button
var setting_button = document.getElementById('settings'); // button
var setting_form = document.getElementById('settings_form'); // page
var scoreButton = document.getElementById('highScores'); // button
var score_form = document.getElementById('highScore_form'); // page
var highScoreBack = document.getElementById('highScoreBack'); // back button // in high score page
var targetInput = document.getElementById('scoreTarget'); // submit button // in setting page
var removeCellButton = document.getElementById('removeCell');
var disableRemoveButton  = document.getElementById('disableRemove');
var undoButton = document.getElementById('undoMove');

var canvas = document.getElementById('canvas');
var width = canvas.width / boardSize - 6; // ?class?
var scoreTarget = targetInput.value; // sets scoreTarget equal to user input score target // ?class?
var ctx = canvas.getContext('2d'); // color boxes 2d array // ?class?
var cells = []; // 2d aray to store number values // ?class?
var fontSize; // ?class?

var game; // creates a game board

var keypads = document.querySelector("#keypads");
var upKeypad = document.querySelector("#keypad-up");
var downKeypad = document.querySelector("#keypad-down");
var leftKeypad = document.querySelector("#keypad-left");
var rightKeypad = document.querySelector("#keypad-right");

//startNew.addEventListener('click', function() {startGame(event)});
startNew.addEventListener('click', checkInput); // checks valid score target then start game
setting_button.addEventListener('click', showSettings); // opens settings page
scoreButton.addEventListener('click',  showHighscore); // opens high score page
removeCellButton.addEventListener('click',  removeCell); // primes remove cell action
undoButton.addEventListener('click',  undoLastMove); // undoes move

// arrows keypad event listener
upKeypad.addEventListener("click", function(err) {up(); manageGameState();});
downKeypad.addEventListener("click", function(err) {down(); manageGameState();});
leftKeypad.addEventListener("click", function(err) {left(); manageGameState();});
rightKeypad.addEventListener("click", function(err) {right(); manageGameState();});

function removeCell()
{
  if (game.removeSquare == 0){
    alert("You are out of moves!");
    return
  }
  game.remove_check = false;
  canvas.addEventListener('click', subtractRemoveCounter);
}

function subtractRemoveCounter(e)
{
  if (game.removeSquare > 0) {
    game.deepCopyBoard(); // saves removed cell as last board

    let currentX = e.offsetX -20; //x position relative to canvas
    let currentY = e.offsetY-20; // y position relative to canvas
    let xPos; //points to x position in array
    let yPos; //points to y possition in array
    ref = 0 // x/y coord ref
    counter = 0; //tracks current position on the board
    while (ref <= width * parseInt(game.size))
    {
      if (currentX > ref && currentX <= (counter+1) * width){
        xPos = counter
      }
      if (currentY > ref && currentY <= (counter+1) * width){
        yPos = counter
      }
      counter += 1;
      ref += width;
    }

    game.score -= game.board[yPos][xPos].value;
    scoreLabel.innerHTML = 'Score : ' + game.score; // add score after removals
    game.board[yPos][xPos].value = null;
    game.drawAllCells(canvas);
    game.gameStatus = 'UNFINISHED'; //make sure game status is set to unfinished
    game.removeSquare-=1;
    canvas.removeEventListener('click', subtractRemoveCounter);
    game.moveMade = true;

    return;
  } 
}

function undoLastMove()
{
  game.undoMove();
  game.moveMade = false;
}

function showSettings(event){
  event.preventDefault();
  console.log("inside settings function");
  canvas.hidden = true;
  setting_form.hidden = false;
  mainOptions.hidden = true;
  keypads.hidden = true;
  var back = document.getElementById('settingsBack');;

  back.onclick = function(){
    setting_form.hidden = true;
    canvas.hidden = false;
    mainOptions.hidden = false;
    keypads.hidden = false;
  };
}

function showHighscore(event){
  event.preventDefault();
  console.log("inside score function");
  mainOptions.hidden = true;
  canvas.hidden = true;
  score_form.hidden = false;
  keypads.hidden = true;
};

highScoreBack.onclick = function(){
  score_form.hidden = true;
  canvas.hidden = false;
  mainOptions.hidden = false;
  keypads.hidden = false;
};

class game2048{
  /**
   * @param {*} size 
   * @param {*} target 
   */
  constructor (size=4, target= 2048){
    /**
     * The constructor for game2048 (default params included)
     * ex game = new game2048(3, 1024) => creates a 3x3 board where 1024 is the win score
     */
    this.size = size; // size of board
    this.target = target; // score for win
    this.removeSquare = 2; // this flag signals if the user has used their removed square option during the game
    this.board = this.createBoard(); // creates an empty board of cells
    this.lastMove = null; // this will tract the previous move after a move is made
    this.gameStatus = 'UNFINISHED'; // the game status will be used to identify win states
    this.score = 0; // current game score.
    this.remove_check  = false;
    this.moveMade = false;
    this.lastScore = 0;
    this.undoes = 5; // number of undoes available
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
    this.lastMove = lastboard;
    this.lastScore = this.score;
  }

  undoMove()
  {
    if(this.undoes > 0 && this.moveMade == true)
    {
      this.board = this.lastMove;
      this.score = this.lastScore;
      game.drawAllCells(canvas);
      scoreLabel.innerHTML = 'Score : ' + game.score; // add score after move
      this.undoes--;
    }
  }

  drawCell(cell, canvas) // Takes in individual cell object and current canvas and draws cell onto canvas
  {
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
  
  canvasClean(can) // Takes current canvas and cleans it up.
  {
    let ctx = can.getContext('2d');
    ctx.clearRect(0, 0, 500, 500);
  };

  drawAllCells(can)
  {
    for (let i = 0; i < this.size; i++)
    {
      for (let j = 0; j < this.size; j++)
      {
        this.drawCell(this.board[i][j], can);
      }
    }
  };
  
  checkFull () // Returns false if board is full, else true
  {  
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].value == null) {
          return true;
        }
      }
    }
    return false;
  }

  addRandomcell(can) // class function adds random cell to existing game board in an empty space
  {
    if (this.checkFull() || this.lastMove == null)  // Returns true if board is full or first turn, else false (this.validMove == true)
    {
      while(true)
      {
        var row = Math.floor(Math.random() * boardSize);
        var coll = Math.floor(Math.random() * boardSize);
        if (this.board[row][coll].value == null)
        {        
          if (Math.ceil(Math.random()*99 > 79)) // adds 20% chance to start with 4
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
    }
  };

  moveUp(check)
  {
    var curVal;

    for (let colX = 0; colX < this.size; colX++)
    {
      var curValOrdered = [];
      for (let rowY = this.size -1; rowY >= 0; rowY--)
      {
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }

      if(check == true)
      {
        if (curValOrdered.length > 0)
        {
          for (let y = 0; y < this.size; y++)
          {
            if (curValOrdered != 0)
            {
              curVal = curValOrdered.pop();
              if (this.board[y][colX].value !== curVal) {
                return true;
              }
            } 
          }
        }
      }
      else
      {
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
    }
    return false;
  };

  addUp(check) 
  {
    /**
     * If cells in the same direction are equal and check=False, add cells and merge cells.
     * If check=True, then do not add and do not merge.
     */ 
    for (let colX = 0; colX < this.size; ++colX)
    {
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = rowY;
          if (this.board[cur][colX].value == this.board[cur+1][colX].value) {
            if (check == false) {
              this.score += this.board[cur][colX].value *2;
              this.board[cur][colX].value *= 2;
              this.board[cur+1][colX].value = null;  
            } 
            else 
            {
              return true;
            }    
          }
        }
      }
    }
  };

  moveDown(check)
  {
    var curVal;

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

      if(check == true)
      {
        if (curValOrdered.length > 0)
        {
          for (let y = this.size -1; y >= 0; y--)
          {
            if (curValOrdered != 0)
            { 
              curVal = curValOrdered.pop();
              if (this.board[y][colX].value !== curVal) {
                return true;
              }
            } 
          }
        }
      }
      else
      {
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
    }
    return false;
  };

  addDown(check) 
  {
    /**
     * If cells in the same direction are equal and check=False, add cells and merge cells.
     * If check=True, then do not add and do not merge.
     */ 
    for (let colX = 0; colX < this.size; ++colX)
    { 
      for (let rowY = this.size - 2; rowY >= 0; --rowY)
      { 
        if (this.board[rowY][colX].value != null)
        { 
          let cur = rowY;
          if (this.board[cur][colX].value == this.board[cur+1][colX].value) {
            if (check == false) {
              this.score += this.board[cur][colX].value *2;
              this.board[cur][colX].value *= 2;
              this.board[cur+1][colX].value = null;  
            } 
            else 
            {
              return true;
            }
          }
        }
      }
    }
  };
  
  moveLeft(check)
  {
    var curVal;
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = this.size -1; colX >= 0; colX--)
      {
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }

      if(check == true)
      {
        if (curValOrdered.length > 0)
        {
          for (let x = 0; x < this.size; x++)
          {
            if (curValOrdered != 0)
            {
              curVal = curValOrdered.pop();
              if (this.board[rowY][x].value !== curVal) {
                return true;
              }
            } 
          }
        }
      }
      else
      {
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
    }
    return false;
  };

  addLeft(check) 
  {
    /**
     * If cells in the same direction are equal and check=False, add cells and merge cells.
     * If check=True, then do not add and do not merge.
     */  
    for (let rowY = 0; rowY < this.size; ++rowY)
    {
      for (let colX = this.size - 2; colX >= 0; --colX)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = colX;
          if (this.board[rowY][cur].value == this.board[rowY][cur + 1].value) {
            if (check == false) {
              this.score  += this.board[rowY][cur + 1].value *2;
              this.board[rowY][cur + 1].value *= 2;
              this.board[rowY][cur].value = null;  
            } 
            else 
            {
              return true;
            }       
          }
        }
      }
    }
  };

  moveRight(check)
  {
    var curVal;
    for (let rowY = 0; rowY < this.size; rowY++)
    {
      var curValOrdered = [];
      for (let colX = 0; colX < this.size; colX++)
      {
        if (this.board[rowY][colX].value != null)
        {
          curValOrdered.push(this.board[rowY][colX].value);
        }
      }
      if(check == true)
      {
        if (curValOrdered.length > 0)
        {
          for (let x = this.size -1; x >= 0; x--)
          {
            if (curValOrdered != 0)
            {
              curVal = curValOrdered.pop();
              if (this.board[rowY][x].value !== curVal) {
                return true;
              }
            } 
          }
        }
      }
      else
      {
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
    }
    return false;
  };

  addRight(check)
  {
    /**
     * If cells in the same direction are equal and check=False, add cells and merge cells.
     * If check=True, then do not add and do not merge.
     */ 
    for (let rowY = 0; rowY < this.size; ++rowY)
    {
      for (let colX = this.size - 2; colX >= 0; --colX)
      {
        if (this.board[rowY][colX].value != null)
        {
          let cur = colX;
          if (this.board[rowY][cur].value == this.board[rowY][cur + 1].value) {
            if (check == false) {
              this.score  += this.board[rowY][cur + 1].value *2;
              this.board[rowY][cur + 1].value *= 2;
              this.board[rowY][cur].value = null;
            } 
            else 
            {
              return true
            }          
          } 
        }
      }
    }
  };

  checkValidMove(side) 
  {
    /**
     * catches a string for which side to check
     * runs move function but only checks validMove as true
     * runs add##(check = true)
     * returns true if either call returns true bool
     */
    var move = false;
    var add = false;
    if(side == "up")
    {
      move = this.moveUp(true);
      add = this.addUp(true);
    }
    else if(side == "down")
    {
      move = this.moveDown(true);
      add = this.addDown(true);
    }
    else if(side == "left")
    {
      move = this.moveLeft(true);
      add = this.addLeft(true);
    }
    else if(side == "right")
    {
      move = this.moveRight(true);
      add = this.addRight(true);
    }

    if(move || add)
    {
      return true;
    }
    return false;
  }

  checkStatus()
  {
    /** 
     * traverses the game board to find out current game status
     * possible options
     * WIN: There contains a board pieces that hits the target score
     * LOSE: The board has no empty spaces
     * UNFINISHED: Not one of the 2 statuses above.
     */
    let empty_flag = false;

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

    // Check if there is still a possible move
    if (empty_flag == true) 
    {
      return 'UNFINISHED'
    } 
    else if (this.checkValidMove("up") || this.checkValidMove("down") || this.checkValidMove("left") || this.checkValidMove("right")) 
    {
      return 'UNFINISHED'
    } 
    else 
    {
      return 'LOSE'
    }
  };
}; // end of game2048 class

function cell(row, coll , value=null) // sets new cell where value is either a number OR null if empty;
{
  this.value = value;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

function createCells() // adds new 0 cells to board
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

function canvasClean() // removes cells colors
{
  ctx.clearRect(0, 0, 500, 500);
}

function up() {
  if(game.checkValidMove("up")) {
    console.log("UP Valid");
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveUp(false);
    game.addUp(false);
    game.moveUp(false);
    game.addRandomcell(canvas);
    game.drawAllCells(canvas);
  }
}

function right() {
  if(game.checkValidMove("right")) {
    console.log("Right Valid");
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveRight(false);
    game.addRight(false);
    game.moveRight(false);
    game.addRandomcell(canvas);
    game.drawAllCells(canvas);
  }
}

function down() {
  if(game.checkValidMove("down")) {
    console.log("Down Valid");
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveDown(false);
    game.addDown(false);
    game.moveDown(false);
    game.addRandomcell(canvas);
    game.drawAllCells(canvas);
  }
}

function left() {
  if(game.checkValidMove("left")) {
    console.log("Left Valid");
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveLeft(false);
    game.addLeft(false);
    game.moveLeft(false);
    game.addRandomcell(canvas);
    game.drawAllCells(canvas);
  }
}

function manageGameState() {
  // Update game state UI
  scoreLabel.innerHTML = 'Score : ' + game.score; // add score after move
  game.gameStatus = game.checkStatus();
}

// keyboard button inputs listener
document.onkeyup = function(event)
{
    if (event.keyCode === 38 || event.keyCode === 87) //upward move
    {
      up();
    }
    else if (event.keyCode === 39 || event.keyCode === 68) //right move
    {
      right();
    }
    else if (event.keyCode === 40 || event.keyCode === 83) //down
    {
      down();
    }
    else if (event.keyCode === 37 || event.keyCode === 65) //left
    {
      left();
    } 

    manageGameState();
};

function startGame() // start new game / reset game and board
{
  console.log("Start game");
  canvas.style.opacity = '1.0'; //reset board opacity to normal
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  let currentGame = new game2048(boardSize);
  currentGame.canvasClean(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.addRandomcell(canvas);
  currentGame.drawAllCells(canvas);
  scoreLabel.innerHTML = 'Score : ' + currentGame.score;
  game = currentGame;
}

startGame();

function checkInput() {
  scoreTarget = targetInput.value;
  console.log("scoreTarget is " + scoreTarget);

  if(scoreTarget && (scoreTarget & (scoreTarget - 1)) === 0){
    console.log("YES");
  }
  else{
    console.log("NO");
  }

  startGame();
}
