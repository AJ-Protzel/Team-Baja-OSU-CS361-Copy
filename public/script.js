//var scoreButton = document.getElementById('scoreButton');
var undoButton = document.getElementById('undoButton');
var removeButton = document.getElementById('removeButton');
var highScoreSizeButton = document.getElementById('highScoreSize');

var sizeInput = document.getElementById('size'); // button // in setting page
var boardSize = sizeInput.value; // sets boardSize equal to user input board size // ?class? // in setting page

var score_form = document.getElementById('highScore_form'); // page
var targetInput = document.getElementById('scoreTarget'); // submit button // in setting page
var scoreHolder = null // TODO: grab 4x4 board scores
var endOverlay = document.getElementById('endOverlay'); // page
var canvas = document.getElementById('canvas');
var width = canvas.width / boardSize - 6; // ?class?
var scoreTarget = targetInput.value; // sets scoreTarget equal to user input score target // ?class?
var ctx = canvas.getContext('2d'); // color boxes 2d array // ?class?
var cells = []; // 2d aray to store number values // ?class?
var game; // creates a game board

var upKeypad = document.querySelector("#keypad-up");
var downKeypad = document.querySelector("#keypad-down");
var leftKeypad = document.querySelector("#keypad-left");
var rightKeypad = document.querySelector("#keypad-right");

//startNew.addEventListener('click', checkInput);
//removeCellButton.addEventListener('click',  removeCell);

//startNew.addEventListener('click', checkInput); // checks valid score target then start game
//endStartNew.addEventListener('click', function(){checkInput(); mainOptions.hidden = false;}); // checks valid score target then start game
//setting_button.addEventListener('click', showSettings); // opens settings page
//scoreButton.addEventListener('click',  showHighscore); // opens high score page
//removeCellButton.addEventListener('click',  removeCell); // primes remove cell action
//undoButton.addEventListener('click',  undoLastMove); // undoes move
//debugDB.addEventListener('click', grabFromServer);
//highScoreSizeButton.addEventListener('click', function(){
//  grabFromServer(true);
//})

var colorDict = {
  'default': ['#A9A9A9','#D2691E', '#FF7F50','#ffbf00','#bfff00', '#40ff00', '#00bfff', '#FF7F50', '#0040ff', '#ff0080', '#D2691E', '#FF7F50', '#ffbf00' ],
  'bajaBlast': ['#4A7309','#4D8626','#4F8F34','#519842','#52A251','#54AB5F','#56B46D','#57BE7C','#59C78A','#5BD098','#5CDAA7','#5EE3B5','#60ECC3','#63FFE0'],
  'bubbleBee': ["#FFEA00","#EAD700","#D5C300","#BFB000","#AA9C00","#958900","#807500","#6A6200","#554E00","#403B00","#2B2700","#151400","#000000"],
  'lemonLime': ['#FFD500','#ECCF00','#D8CA00','#C5C400','#B1BF00','#9EB900','#8BB400','#77AE00','#64A800','#50A300','#3D9D00','#299800','#169200']

};

document.getElementById('colorOption').addEventListener('change', changeColor);

function changeColor(){
  let currentPos = document.getElementById('colorShower');
  currentPos.innerHTML = "";
  let color = colorDict[document.getElementById('colorOption').value];
  let currentCell;
  for (x = 0; x < color.length; x++){
    currentCell = document.createElement('td');
    currentCell.style.backgroundColor = color[x];
    console.log(currentCell);
    console.log(currentPos);
    currentPos.appendChild(currentCell);
  }
};

function grabFromServer(check=false){
  console.log("GrabServer Page");
  var payload = {};
  if (check == false)
  {
    payload.size = game.size;
  } else {
    payload.size = highScoreSizeButton.value;
  }
  
  var req = new XMLHttpRequest();
  req.open("POST", "/getDB",true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function(){
    if (req.status >=200 && req.status < 400){
      //console.log('inside grab from server');
      var response = JSON.parse(req.responseText);
      updateHighscore(JSON.parse(response.topscore));
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  })
  req.send(JSON.stringify(payload));
};

function sendToServer(){
  while (game.playerName == null){
    game.playerName = prompt("New Highscore! Enter name for the leaderboard:");
  };  
  //console.log('into send server Client side');
  var req = new XMLHttpRequest();
  var payload = {};
  payload.name = game.playerName;
  payload.score = game.score;
  payload.size  = game.size;
  payload.debug  = "Send from Client -origin";
  req.open('POST', '/sendDB', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function(){
    if (req.status >=200 && req.status < 400){
      var response = JSON.parse(req.responseText);
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  })
  //console.log(JSON.stringify(payload));
  req.send(JSON.stringify(payload));
}

// arrows keypad event listener
upKeypad.addEventListener("click", function() {up(); checkEnd();});
downKeypad.addEventListener("click", function() {down(); checkEnd();});
leftKeypad.addEventListener("click", function() {left(); checkEnd();});
rightKeypad.addEventListener("click", function() {right(); checkEnd();});

function removeClick()
{
  game.remove_check = false;
  canvas.addEventListener('click', subtractRemoveCounter);
}

function subtractRemoveCounter(e)
{
  if (game.removes > 0) {
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
    document.getElementById('scoreContainer').innerHTML = 'Score: ' + game.score;
    game.board[yPos][xPos].value = null;
    game.drawAllCells();
    game.gameStatus = 'UNFINISHED'; //make sure game status is set to unfinished
    game.removes--;
    canvas.removeEventListener('click', subtractRemoveCounter);
    game.moveMade = true;
    removeButton.value = game.removes + " :Remove";

    return;
  } 
}

function undoClick()
{
  game.undoMove();
  game.moveMade = false;
  removeButton.value = game.removes + " :Remove";
}

function togglePage(page)
{
  if(page == 'main')
  {
    document.addEventListener('keyup', makeMove);
    document.getElementById('settingsForm').hidden = true;
    document.getElementById('canvas').hidden = false;
    document.getElementById('mainOp').hidden = false;
    document.getElementById('counters').hidden = false;
    document.getElementById('scoreButton').hidden = false;
    keypads.hidden = false;
    document.getElementById('settingsButton').value = "Settings";

    document.addEventListener('keyup', makeMove);
    document.getElementById('highScoreForm').hidden = true;
    document.getElementById('canvas').hidden = false;
    document.getElementById('mainOp').hidden = false;
    document.getElementById('counters').hidden = false;
    keypads.hidden = false;
    document.getElementById('scoreButton').value = "Scores";  
  }

  if(page == 'settings')
  {
    if(document.getElementById('settingsForm').hidden == true && document.getElementById('canvas').hidden == false) // main page -> settings
    {
      document.removeEventListener('keyup', makeMove);
      console.log("Settings Page");
      document.getElementById('canvas').hidden = true;
      document.getElementById('settingsForm').hidden = false;
      document.getElementById('counters').hidden = true;
      //document.getElementById('scoreButton').hidden = true;
      keypads.hidden = true;
      document.getElementById('settingsButton').value = "Back";
    }
    else if(document.getElementById('settingsForm').hidden == true && document.getElementById('canvas').hidden == true) // scores -> settings
    {
      document.addEventListener('keyup', makeMove);
      document.getElementById('highScoreForm').hidden = true;
      document.getElementById('canvas').hidden = false;
      document.getElementById('mainOp').hidden = false;
      document.getElementById('counters').hidden = false;
      keypads.hidden = false;
      document.getElementById('scoreButton').value = "Scores"; 
      
      document.removeEventListener('keyup', makeMove);
      console.log("Settings Page");
      document.getElementById('canvas').hidden = true;
      document.getElementById('settingsForm').hidden = false;
      document.getElementById('counters').hidden = true;
      //document.getElementById('scoreButton').hidden = true;
      keypads.hidden = true;
      document.getElementById('settingsButton').value = "Back";
    }
    else // closing settings
    {
      document.addEventListener('keyup', makeMove);
      document.getElementById('settingsForm').hidden = true;
      document.getElementById('canvas').hidden = false;
      document.getElementById('mainOp').hidden = false;
      document.getElementById('counters').hidden = false;
      document.getElementById('scoreButton').hidden = false;
      keypads.hidden = false;
      document.getElementById('settingsButton').value = "Settings";
    }
  }

  if(page == 'highScores')
  {
    if(document.getElementById('highScoreForm').hidden == true && document.getElementById('canvas').hidden == false) // main page -> scores
    {
      document.removeEventListener('keyup', makeMove);
      grabFromServer(); // this grabs the score DB (by game.size) and fills the high score table 
      console.log("HighScores Page");
      //document.getElementById('mainOp').hidden = true;
      document.getElementById('counters').hidden = true;
      keypads.hidden = true
      document.getElementById('canvas').hidden = true;
      document.getElementById('highScoreForm').hidden = false;
      document.getElementById('scoreButton').value = "Back";
    
    }
    else if(document.getElementById('highScoreForm').hidden == true && document.getElementById('canvas').hidden == true) // settings -> scores
    {
      document.addEventListener('keyup', makeMove);
      document.getElementById('settingsForm').hidden = true;
      document.getElementById('canvas').hidden = false;
      document.getElementById('mainOp').hidden = false;
      document.getElementById('counters').hidden = false;
      document.getElementById('scoreButton').hidden = false;
      keypads.hidden = false;
      document.getElementById('settingsButton').value = "Settings";

      document.removeEventListener('keyup', makeMove);
      grabFromServer(); // this grabs the score DB (by game.size) and fills the high score table 
      console.log("HighScores Page");
      //document.getElementById('mainOp').hidden = true;
      document.getElementById('counters').hidden = true;
      keypads.hidden = true
      document.getElementById('canvas').hidden = true;
      document.getElementById('highScoreForm').hidden = false;
      document.getElementById('scoreButton').value = "Back";
    }
    else
    {
      document.addEventListener('keyup', makeMove);
      document.getElementById('highScoreForm').hidden = true;
      document.getElementById('canvas').hidden = false;
      document.getElementById('mainOp').hidden = false;
      document.getElementById('counters').hidden = false;
      keypads.hidden = false;
      document.getElementById('scoreButton').value = "Scores";  
    }
  }
}

function updateHighscore(scores)
{
  for(let i = 0; i < 10; i++)
  {
    if(scores[i] != null)
    {
      document.getElementById('name'+ (i+1).toString()).innerHTML = scores[i].name
      document.getElementById('score'+ (i+1).toString()).innerHTML = scores[i].score
      document.getElementById('size'+ (i+1).toString()).innerHTML = scores[i].size
    } 
    else 
    {
      document.getElementById('name'+ (i+1).toString()).innerHTML = "";
      document.getElementById('score'+ (i+1).toString()).innerHTML = "";
      document.getElementById('size'+ (i+1).toString()).innerHTML = "";
    }
  }
};

class game2048{
  /**
   * @param {*} size 
   * @param {*} target 
   */
  constructor (size = 4, target = 2048){
    /**
     * The constructor for game2048 (default params included)
     * ex game = new game2048(3, 1024) => creates a 3x3 board where 1024 is the win score
     */
    this.size = size; // size of board
    this.target = target; // score for win
    this.removes = 2; // this flag signals if the user has used their removed square option during the game
    this.board = this.createBoard(); // creates an empty board of cells
    this.lastMove = null; // this will tract the previous move after a move is made
    this.gameStatus = 'UNFINISHED'; // the game status will be used to identify win states
    this.score = 0; // current game score.
    this.remove_check  = false;
    this.moveMade = false;
    this.lastScore = 0;
    this.undoes = 5; // number of undoes available
    this.validMove = false; // checks if a valid move occurs each round
    this.scoreAdded = false; //sees if score has beed added/compared to highscore board already
    this.playerName = null;
    this.color = colorDict[document.getElementById('colorOption').value];
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
      document.getElementById('scoreContainer').innerHTML = 'Score: ' + this.score;
      this.undoes--;
    }
    undoButton.value = this.undoes + " :Undo";
  }

  drawCell(cell) // Takes in individual cell object and current canvas and draws cell onto canvas
  {
    ctx.beginPath();
    ctx.rect(cell.x, cell.y, width, width);
    ctx.fillStyle =  this.cellColor(cell.value);
    ctx.fill();
    if (cell.value){
      let fontSize = width / 2.5;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
    }
  };

  cellColor(val)
  {
    let color  = this.color;
    switch (val)
    {
      case null : return color[0]; break;
      case 2 : 
        return color[1]; 
      case 4 :
        return color[2];
      case 8 : 
        return color[3];
      case 16 : 
        return color[4];
      case 32 : 
        return color[5];
      case 64 : 
        return color[6]; 
      case 128 : 
        return color[7];
      case 256 : 
        return color[8]; 
      case 512 : 
        return color[9];
      case 1024 : 
        return color[10];
      case 2048 : 
        return color[11];
      case 4096 : 
        return color[12];
    }
  };
  
  canvasClean() // Takes current canvas and cleans it up.
  {
    ctx.clearRect(0, 0, 500, 500);
  };

  drawAllCells()
  {
    for (let i = 0; i < this.size; i++)
    {
      for (let j = 0; j < this.size; j++)
      {
        this.drawCell(this.board[i][j]);
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

  addRandomcell() // class function adds random cell to existing game board in an empty space
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
              if (this.board[y][colX].value !== curVal)
              {
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
              if (this.board[y][colX].value !== curVal)
              {
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
              if (this.board[rowY][x].value !== curVal)
              {
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
              if (this.board[rowY][x].value !== curVal)
              {
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

  add(dir, check)
  {
    if(dir == "v")
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
              if (check == false)
              {
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
    }
    else if(dir == "h")
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
              if (check == false)
              {
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
    }
    return false;
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

    if(side == "up" || side == "all")
    {
      move = this.moveUp(true);
      add = this.add("v", true);

      if(move || add)
      {
        return true;
      }
    }
    if(side == "down" || side == "all")
    {
      move = this.moveDown(true);
      add = this.add("v", true);

      if(move || add)
      {
        return true;
      }
    }
    if(side == "left" || side == "all")
    {
      move = this.moveLeft(true);
      add = this.add("h", true);
      
      if(move || add)
      {
        return true;
      }
    }
    if(side == "right" || side == "all")
    {
      move = this.moveRight(true);
      add = this.add("h", true);
  
    if(move || add)
    {
      return true;
      }
    }

    return false;
  }

  checkScoreTarget()
  {
    for (let i = 0; i < this.size; i++)
    {
      for (let j = 0; j < this.size; j++)
      {     
        if (this.board[i][j].value == this.target)
        {
          return true;
        }
      }
    }
    
    return false;
  }
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

function up() {
  if(game.checkValidMove("up")) {
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveUp(false);
    game.add("v", false);
    game.moveUp(false);
    game.addRandomcell();
    game.drawAllCells();
  }
}

function down() {
  if(game.checkValidMove("down")) {
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveDown(false);
    game.add("v", false);
    game.moveDown(false);
    game.addRandomcell();
    game.drawAllCells();
  }
}

function left() {
  if(game.checkValidMove("left")) {
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveLeft(false);
    game.add("h", false);
    game.moveLeft(false);
    game.addRandomcell();
    game.drawAllCells();
  }
}

function right() {
  if(game.checkValidMove("right")) {
    game.moveMade = true;
    game.deepCopyBoard();
    game.moveRight(false);
    game.add("h", false);
    game.moveRight(false);
    game.addRandomcell();
    game.drawAllCells();
  }
}

function checkEnd() // keyboard button inputs listener
{
  document.getElementById('scoreContainer').innerHTML = 'Score: ' + game.score;

  if(game.checkScoreTarget()) // if score target is reached return true
  {
    sendToServer();
    document.removeEventListener('keyup', makeMove);
    winningImage(); // display image if the player ranked 1st, 2nd or 3rd
    canvas.style.opacity = '0.5';
    document.getElementById('mainOp').hidden = true;
    document.getElementById('counters').hidden = true;
    endOverlay.style.display = "block";
  }
  else if(!game.checkValidMove("all"))
  {
    document.removeEventListener('keyup', makeMove);
    canvas.style.opacity = '0.5';
    document.getElementById('mainOp').hidden = true;
    document.getElementById('counters').hidden = true;
    endOverlay.style.display = "block";
    sendToServer();
    winningImage(); // display image if the player ranked 1st, 2nd or 3rd
    var winText = document.getElementById('winText').hidden = true;
  }
}

function makeMove(event)
{
    if ((event.keyCode === 38 || event.keyCode === 87)) //upward move
    {
      up();
    }
    else if ((event.keyCode === 40 || event.keyCode === 83)) //down
    {
      down();
    }
    else if ((event.keyCode === 37 || event.keyCode === 65)) //left
    {
      left();
    }
    else if ((event.keyCode === 192)) //sneaky cheat code on the squggly under escape
    {
      easterEggScore();
    } 
    else if ((event.keyCode === 39 || event.keyCode === 68)) //right move
    { 
      right();
    }

    checkEnd();
};

function easterEggScore()
{
  while (game.playerName == null)
  {
    game.playerName = prompt("Cheat your way to the top! Enter name for the leaderboard:");
  }

  let cheatScore;
  while (cheatScore == null)
  {
   cheatScore = prompt("Enter your unreasonable high score:");
  }
  
  let cheatSize;
  while (cheatSize == null || (cheatSize > 10 || cheatSize < 3))
  {
   cheatSize = prompt("Enter the size of your board (3-10):");
  }
  console.log('into send server Client side');

  var req = new XMLHttpRequest();
  var payload = {};
  payload.name = game.playerName;
  payload.score = parseInt(cheatScore);
  payload.size  = parseInt(cheatSize);
  payload.debug  = "Send from Client -origin";
  req.open('POST', '/sendDB', true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function()
  {
    if (req.status >=200 && req.status < 400)
    {
      var response = JSON.parse(req.responseText);
    }
  })
}

function winningImage() {
  var req = new XMLHttpRequest();
  var payload = {};
  payload.size = game.size;
  req.open("POST", "/getDB",true);
  req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load', function(){
    if (req.status >=200 && req.status < 400){
      //console.log('inside grab from server');
      var response = JSON.parse(req.responseText);
      let highScores = JSON.parse(response.topscore);
      for (let i = 0; i < 3; i ++) {
        if (highScores[i].name == game.playerName && highScores[i].score == game.score) {
          let winImage = document.querySelector("#winImage");
          winImage.hidden = false;
        }
      }
    } else {
      console.log("Error in network request: " + req.statusText);
    }
  })
  console.log(JSON.stringify(payload));
  req.send(JSON.stringify(payload));
}

function startGame() // start new game / reset game and board
{
  stop();

  document.querySelector("#winImage").hidden = true;
  console.log("Start game");
  document.addEventListener('keyup', makeMove);
  document.getElementById("title").innerHTML = scoreTarget; // changes game title to score target
  canvas.style.opacity = '1.0'; //reset board opacity to normal
  endOverlay.style.display = "none";
  document.getElementById('winText').hidden = false;
  //document.getElementById('mainOp').hidden = false;
  //document.getElementById('coutners').hidden = false;
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  let currentGame = new game2048(boardSize, scoreTarget);
  currentGame.canvasClean();
  currentGame.addRandomcell();
  currentGame.addRandomcell();
  currentGame.drawAllCells();
  document.getElementById('scoreContainer').innerHTML = 'Score: ' + currentGame.score;
  undoButton.value = currentGame.undoes + " :Undo";
  removeButton.value = currentGame.removes + " :Remove";

  keypads.hidden = false;

  game = currentGame;
}

function checkInput() {
  scoreTarget = targetInput.value;
 
  if(!(scoreTarget && (scoreTarget & (scoreTarget - 1)) === 0)){
    var num = 2;
    while(scoreTarget > num)
    {
      num *= 2;
    }
    scoreTarget = num;
    alert("Score target will be rounded to " + scoreTarget);
  }
}

function startClick()
{
  //document.getElementById('mainOp').hidden = false;
  //document.getElementById('counters').hidden = false;
  checkInput();
  togglePage('main');
  //document.getElementById('mainOp').hidden = false;
  //document.getElementById('coutners').hidden = false;
  startGame();
}
/*
highScoreBack.onclick = function(){
  //score_form.hidden = true;
  //canvas.hidden = false;
  //mainOptions.hidden = false;
  //keypads.hidden = false;
  //document.addEventListener('keyup', makeMove);
}
*/

startGame();
