/*code adapted from https://github.com/amadevBox/2048*/

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var sizeInput = document.getElementById('size'); // button
var changeSize = document.getElementById('change-size'); // button
var scoreLabel = document.getElementById('score-container'); // display
var score = 0;
var boardSize = 4; // default
var width = canvas.width / boardSize - 6;
var cells = [];
var fontSize;
var loss = false;
var movementMade = true;
var countFree;
startGame();

// sets new cell as 0 (false)
function cell(row, coll)
{
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

// adds new 0 cells to board
function createCells()
{
  var i, j;
  for(i = 0; i < boardSize; i++)
  {
    cells[i] = [];
    for(j = 0; j < boardSize; j++)
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
document.onkeydown = function(event)
{
  if (!loss) // if board is full but there is a move option, allow input
  {
    movementMade = false;
    if (event.keyCode === 38 || event.keyCode === 87)
    {
      moveUp();
      addUp();
    }
    else if (event.keyCode === 39 || event.keyCode === 68)
    {
      moveRight();
      addRight();
    }
    else if (event.keyCode === 40 || event.keyCode === 83)
    {
      moveDown(); 
      addDown();
    }
    else if (event.keyCode === 37 || event.keyCode === 65)
    {
      moveLeft(); 
      addLeft();
    }

    scoreLabel.innerHTML = 'Score : ' + score; // add score after move

    countFreeCells(); // check if board is full, return t/f
    if(countFree == 0)
    {
      checkGameLoss(); // end game if returned lose == true
	  }
  }
}

// start new game / reset bgame and board
function startGame()
{
  canvas.style.opacity = '1.0';
  loss = false;
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  canvasClean();
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();
  score = 0;
  scoreLabel.innerHTML = 'Score : ' + score;
}

// Start New Game button press
changeSize.onclick = function()
{
  startGame();
}

// end game 
function finishGame()
{
  canvas.style.opacity = '0.5';
  loss = true;
}

// puts numbers and colored squares
function drawAllCells()
{
  var i, j;
  for(i = 0; i < boardSize; i++)
  {
    for(j = 0; j < boardSize; j++)
    {
      drawCell(cells[i][j]);
    }
  }
}

// returns t/f if board if full
function countFreeCells()
{
    countFree = 0;
    var i, j;
  for(i = 0; i < boardSize; i++)
  {
    for(j = 0; j < boardSize; j++)
    {
      if(!cells[i][j].value)
      {
        countFree++;
      }
    }
  }
}

// if board is not full, paste new 2 or 4 cell
function pasteNewCell()
{
  countFreeCells();
  
  if(!countFree)
  {
    finishGame();
    return;
  }
  while(true)
  {
    var row = Math.floor(Math.random() * boardSize);
    var coll = Math.floor(Math.random() * boardSize);
    if(!cells[row][coll].value)
    {
      if(Math.ceil(Math.random()*99 > 79)) // adds 20% chance to start with 4
      { 
        cells[row][coll].value = 4;
      }
      else
      {
        cells[row][coll].value = 2;
      }
      drawAllCells();
      return;
    }
  }
}

// shift all cells to right
function moveRight()
{
  var rowY, colX;
  var cur;
  for(rowY = 0; rowY < boardSize; ++rowY)
  {
    for(colX = boardSize - 2; colX >= 0; --colX)
    {
      if(cells[rowY][colX].value)
      {
        cur = colX;
        while(cur + 1 < boardSize)
        {
          if(!cells[rowY][cur + 1].value)
          {
            cells[rowY][cur + 1].value = cells[rowY][cur].value;
            cells[rowY][cur].value = 0;
            cur++;
            movementMade = true;
          }
          else
          {
            break;
          }
        }
      }
    }
  }
}

// check cells to right, add if ==
function addRight()
{
  var rowY, colX;
  var cur;
  for(rowY = 0; rowY < boardSize; ++rowY)
  {
    for(colX = boardSize - 2; colX >= 0; --colX)
    {
      if(cells[rowY][colX].value)
      {
        cur = colX;
        if(cells[rowY][cur].value == cells[rowY][cur + 1].value)
        {
          cells[rowY][cur + 1].value *= 2;
          score +=  cells[rowY][cur + 1].value;
          cells[rowY][cur].value = 0;
          movementMade = true;
        }
      }
    }
  }
  moveRight();
  if(movementMade)
  {
    pasteNewCell();
  }
}

function moveLeft()
{
  var rowY, colX;
  var cur;
  for(rowY = 0; rowY < boardSize; rowY++)
  {
    for(colX = 1; colX < boardSize; colX++)
    {
      if(cells[rowY][colX].value)
      {
        cur = colX;
        while (cur - 1 >= 0){
          if (!cells[rowY][cur - 1].value)
          {
            cells[rowY][cur - 1].value = cells[rowY][cur].value;
            cells[rowY][cur].value = 0;
            cur--;
            movementMade = true;
          } 
          else 
          {
            break; 
          }
        }
      }
    }
  }
}

function addLeft() 
{
  var rowY, colX;
  var cur;
  for(rowY = 0; rowY < boardSize; rowY++) 
  {
    for(colX = 1; colX < boardSize; colX++) 
    {
      if(cells[rowY][colX].value) 
      {
        cur = colX;
        if (cells[rowY][cur].value == cells[rowY][cur - 1].value) 
        {
          cells[rowY][cur - 1].value *= 2;
          score +=   cells[rowY][cur - 1].value;
          cells[rowY][cur].value = 0;
          movementMade = true;
        } 
      }
    }
  }
  moveLeft();
  if(movementMade)
  {
    pasteNewCell();
  }
}

function moveUp()
{
  var rowY, colX, cur;
  for(colX = 0; colX < boardSize; colX++)
  {
    for(rowY = 1; rowY < boardSize; rowY++)
    {
      if(cells[rowY][colX].value)
      {
        cur = rowY;
        while (cur > 0)
        {
          if(!cells[cur - 1][colX].value)
          {
            cells[cur - 1][colX].value = cells[cur][colX].value;
            cells[cur][colX].value = 0;
            cur--;
            movementMade = true;
          }  
          else 
          {
            break; 
          }
        }
      }
    }
  }
}

function addUp()
{
  var rowY, colX, cur;
  for(colX = 0; colX < boardSize; colX++)
  {
    for(rowY = 1; rowY < boardSize; rowY++)
    {
      if(cells[rowY][colX].value)
      {
        cur = rowY;
        if (cells[cur][colX].value == cells[cur - 1][colX].value)
        {
          cells[cur - 1][colX].value *= 2;
          score += cells[cur - 1][colX].value;
          cells[cur][colX].value = 0;
          movementMade = true;
        } 
      }
    }
  }
  moveUp();
  if(movementMade)
  {
    pasteNewCell();
  }
}

function moveDown()
{
  var rowY, colX, row;
  for(colX = 0; colX < boardSize; colX++)
  {
    for(rowY = boardSize - 2; rowY >= 0; rowY--)
    {
      if(cells[rowY][colX].value)
      {
        cur = rowY;
        while (cur + 1 < boardSize)
        {
          if (!cells[cur + 1][colX].value)
          {
            cells[cur + 1][colX].value = cells[cur][colX].value;
            cells[cur][colX].value = 0;
            cur++;
            movementMade = true;
          }  
          else
          {
            break; 
          }
        }
      }
    }
  }
}

function addDown()
{
  var rowY, colX, cur;
  for(colX = 0; colX < boardSize; colX++)
  {
    for(rowY = boardSize - 2; rowY >= 0; rowY--)
    {
      if(cells[rowY][colX].value)
      {
        cur = rowY;
        if (cells[cur][colX].value == cells[cur + 1][colX].value)
        {
          cells[cur + 1][colX].value *= 2;
          score +=  cells[cur + 1][colX].value;
          cells[cur][colX].value = 0;
          movementMade = true;
        } 
      }
    }
  } 
  moveDown();
  if(movementMade)
  {
    pasteNewCell();
  }
}

// checks if move if possible on full board
function checkGameLoss()
{
  loss = true;

  // Up
  var rowY, colX, cur;
  for(colX = 0; colX < boardSize; colX++)
  {
    for(rowY = 1; rowY < boardSize; rowY++)
    {
      cur = rowY;
      if (cells[cur][colX].value == cells[cur - 1][colX].value)
      {
        loss = false;
      } 
    }
  }

  // Down
  for(colX = 0; colX < boardSize; colX++)
    {
    for(rowY = boardSize - 2; rowY >= 0; rowY--)
    {
      cur = rowY;
      if (cells[cur][colX].value == cells[cur + 1][colX].value)
      {
        loss = false;     
      } 
    }
  } 

  // Left
  for(rowY = 0; rowY < boardSize; rowY++) 
    {
    for(colX = 1; colX < boardSize; colX++) 
    {
      cur = colX;
      if (cells[rowY][cur].value == cells[rowY][cur - 1].value) 
      {
        loss = false; 
      }
    }
  }

  // Right
  for(rowY = 0; rowY < boardSize; ++rowY)
    {
    for(colX = boardSize - 2; colX >= 0; --colX)
    {
      cur = colX;
      if(cells[rowY][cur].value == cells[rowY][cur + 1].value)
      {
        loss = false;    
      }
    }
  }

  if(loss)
  {
    finishGame();
  }
}
