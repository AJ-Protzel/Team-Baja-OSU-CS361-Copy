/*code adapted from https://github.com/amadevBox/2048*/

var scoreLabel = document.getElementById('score-container'); // display

var mainOptions = document.getElementById('mainOptions');
  var sizeInput = document.getElementById('size'); // button
    var boardSize = sizeInput.value; // sets boardSize equal to user input board size // ?class?
  var startNew = document.getElementById('start-new'); // button

  var setting_button = document.getElementById('settings'); // button
  var setting_form = document.getElementById('settings_form'); // page

  var scoreButton = document.getElementById('highScores'); // button
  var score_form = document.getElementById('highScore_form'); // page
  var highScoreBack = document.getElementById('highScoreBack'); // back button

  var targetInput = document.getElementById('scoreTarget'); // submit button
    var scoreTarget = targetInput.value; // sets scoreTarget equal to user input score target // ?class?
      //console.log("is " + scoreTarget);

var canvas = document.getElementById('canvas');

var width = canvas.width / boardSize - 6; // ?class?
var ctx = canvas.getContext('2d'); // color boxes 2d array // ?class?
var cells = []; // 2d aray to store number values // ?class?
var fontSize; // ?class?

var game; // creates a game board

//arrays for sorting the highscore board
var highscoreNames = []; 
var highscoreScores = [];
var highscoreDates = [];

//startNew.addEventListener('click', function() {startGame(event)});
startNew.addEventListener('click', function() {checkInput(event)});
setting_button.addEventListener('click', function() {showSettings(event)});
scoreButton.addEventListener('click',  function() {showHighscore(event)});

/*
var canvas = document.getElementById('canvas'); //background square
var setting_button = document.getElementById('settings');
var setting_form = document.getElementById('settings_form');
var score_form = document.getElementById('highScore_form');
var scoreButton = document.getElementById('highScores');
var highScoreBack = document.getElementById('highScoreBack');
var ctx = canvas.getContext('2d');
//var mainOptions = document.getElementById('mainOptions');
//var sizeInput = document.getElementById('size'); // button
var changeSize = document.getElementById('change-size'); // button
//var scoreLabel = document.getElementById('score-container'); // display
//var boardSize = 4; // default
var width = canvas.width / boardSize - 6; //-6 moves cell image to center
var cells = [];
var fontSize;
var loss = false;
var movementMade = true;
var countFree;
var game;

//setting_button.addEventListener('click', function() {showSettings(event)});
//scoreButton.addEventListener('click',  function() {showHighscore(event)});
*/
function showSettings(event){
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
  i.setAttribute('max', '16');

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

function showHighscore(event){
  console.log("inside score function");
  mainOptions.hidden = true;
  canvas.hidden = true;
  score_form.hidden = false;

  if(game.gameStatus == 'LOSE')
  {
    updateHighscore();
  }
};

function updateHighscore()
{
  console.log("updating highscore");

  //gets date for scoreboard when called
  var today = new Date();
  var currentDate =  (today.getMonth() + 1) + '/' + (today.getDate()) + '/' + today.getFullYear();

  let highscorePlacement = checkHighScore(game.score, currentDate);
  if(highscorePlacement != null)
  {
    //highscoreNames.splice(highscorePlacement, 0, playerName); PLAYER NAME WOULD GO HERE SO IT APPEARS IN ARRAY
    highscoreScores.splice(highscorePlacement, 0, game.score);
    highscoreDates.splice(highscorePlacement, 0, currentDate);
  }

  if(highscoreScores.length > 10)
  {
    highscoreNames.pop()
    highscoreScores.pop()
    highscoreDates.pop()
  }

  //update the board
  //gets elements from the highscore board and sets them
  if(highscoreScores[0] != null){
  document.getElementById('name1').innerHTML = 'test1'; //name stored in array goes here
  document.getElementById('score1').innerHTML = highscoreScores[0];
  document.getElementById('date1').innerHTML = highscoreDates[0];
  }

  if(highscoreScores[1] != null){
  document.getElementById('name2').innerHTML = 'test2'; //name stored in array goes here
  document.getElementById('score2').innerHTML = highscoreScores[1];
  document.getElementById('date2').innerHTML = highscoreDates[1];
  }

  if(highscoreScores[2] != null){
  document.getElementById('name3').innerHTML = 'test3'; //name stored in array goes here
  document.getElementById('score3').innerHTML = highscoreScores[2];
  document.getElementById('date3').innerHTML = highscoreDates[2];
  }

  if(highscoreScores[3] != null){
  document.getElementById('name4').innerHTML = 'test4'; //name stored in array goes here
  document.getElementById('score4').innerHTML = highscoreScores[3];
  document.getElementById('date4').innerHTML = highscoreDates[3];
  }

  if(highscoreScores[4] != null){
  document.getElementById('name5').innerHTML = 'test5'; //name stored in array goes here
  document.getElementById('score5').innerHTML = highscoreScores[4];
  document.getElementById('date5').innerHTML = highscoreDates[4];
  }

  if(highscoreScores[5] != null){
  document.getElementById('name6').innerHTML = 'test6'; //name stored in array goes here
  document.getElementById('score6').innerHTML = highscoreScores[5];
  document.getElementById('date6').innerHTML = highscoreDates[5];
  }

  if(highscoreScores[6] != null){
  document.getElementById('name7').innerHTML = 'test7'; //name stored in array goes here
  document.getElementById('score7').innerHTML = highscoreScores[6];
  document.getElementById('date7').innerHTML = highscoreDates[6];
  }

  if(highscoreScores[7] != null){
  document.getElementById('name8').innerHTML = 'test8'; //name stored in array goes here
  document.getElementById('score8').innerHTML = highscoreScores[7];
  document.getElementById('date8').innerHTML = highscoreDates[7];
  }

  if(highscoreScores[8] != null){
  document.getElementById('name9').innerHTML = 'test9'; //name stored in array goes here
  document.getElementById('score9').innerHTML = highscoreScores[8];
  document.getElementById('date9').innerHTML = highscoreDates[8];
  }

  if(highscoreScores[9] != null){
  document.getElementById('name10').innerHTML = 'test10'; //name stored in array goes here
  document.getElementById('score10').innerHTML = highscoreScores[9];
  document.getElementById('date10').innerHTML = highscoreDates[9];
  }
};

function checkHighScore(currentScore, date) //also player name
{
  if(currentScore > 0)
  {
    //if there are other scores on the leaderboard
    if(highscoreScores[0] != null)
    {
    for(let i = 0; i < highscoreScores.length; i++)
    {
      if(currentScore >= highscoreScores[i])
      { 
        if(currentScore == highscoreScores[i]) //check to see that the same exact score from the same game not relogged
        {
          if(highscoreDates[i] != date) //ADD || NAME CHECK AS WELL
          {
          return i; //return where this should go on the board
          }
          else
          {
            return null;
          }
        }
        else
        {
          return i;
        }
      }
    }
    return null; //or null, if its not within the top 10
    }
    else //the board is empty
    {
      return 0;
    }
  }
  else //score is blank
  {
    return null;
  }
};

highScoreBack.onclick = function(){
  score_form.hidden = true;
  canvas.hidden = false;
  mainOptions.hidden = false;
};

/*
changeSize.onclick = function()
{
    boardSize = sizeInput.value;
    width = canvas.width / boardSize - 6;
    canvasClean();
    startGame();
}
*/

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
      //case 0 : return '#A9A9A9'; break;
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
  
  checkFull () {
    // Returns true if board is full, else false
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j].value == null) {
          return true;
        }
      }
    }
    return false;
  }

  addRandomcell(can)
  {
    /**
     * class function adds random cell to existing game board in an empty space
     */
    //console.log('inside addRandom');
    
    if (this.checkFull()) { // Returns true if board is full, else false
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

  addRight(check){
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
            } else {
              return true
            }          
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

  addLeft(check) {
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
            } else {
              return true;
            }       
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

  addUp(check) {
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
            } else {
              return true;
            }    
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

  addDown(check) {
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
            } else {
              return true;
            }
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
    if (empty_flag == true) {
      return 'UNFINISHED'
    } else if (this.addDown(check=true) || this.addLeft(check=true) || this.addRight(check=true) || this.addUp(check=true)) {
      return 'UNFINISHED'
    } else {
      return 'LOSE'
    };
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
/*
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
*/
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
      //console.log('Pre-move');
      //console.log(game.board);
      game.deepCopyBoard();
      game.moveUp();
      game.addUp(check=false);
      //console.log('post-move')
      //console.log(game.board);
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 39 || event.keyCode === 68) //right move
    {
      game.deepCopyBoard();
      game.moveRight();
      game.addRight(check=false);
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 40 || event.keyCode === 83) //downawrd move
    {
      game.deepCopyBoard();
      game.moveDown(); 
      game.addDown(check=false);
      game.drawAllCells(canvas);
    }
    else if (event.keyCode === 37 || event.keyCode === 65) //left move
    {
      game.deepCopyBoard();
      game.moveLeft(); 
      game.addLeft(check=false);
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
/*
// Start New Game button press
changeSize.onclick = function()
{
  startGame();
}
*/