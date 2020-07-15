/*code adapted from https://github.com/amadevBox/2048*/

var sizeInput = document.getElementById('size');
var changeSize = document.getElementById('change-size');
var scoreLabel = document.getElementById('score');
var score = 0;
var boardSize = 4;
var width = canvas.width / boardSize - 6;
var cells = [];
var fontSize;
var loss = false;
var movementMade = true;
var countFree;

startGame();

function startGame() {
  boardArea.start();
  boardCells = function() {
    var i, j;
    for(i = 0; i < boardSize; i++) {
      cells[i] = [];
      for(j = 0; j < boardSize; j++) {
        cells[i][j] = new cell(i, j);
      }
    }
  }

  loss = false;
  boardSize = sizeInput.value;
  width = canvas.width / boardSize - 6;
  pasteNewCell();
  pasteNewCell();
  score = 0;
  scoreLabel.innerHTML = 'Score : ' + score;
}

var boardArea = {
  canvas: document.getElementById('canvas'),
  start: function() {
    this.canvas.style.opacity = '1.0';
    this.ctx = this.canvas.getContext('2d');
  },
  clean: function() {
    this.context.clearRect(0, 0, 500, 500);
  }
}

function cell(row, coll) {
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
  this.drawCell = function() {
    ctx = boardArea.context;
    switch (this.value) {
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
    ctx.fillRect(this.x, this.y, width, width);
    if (cell.value) {
      fontSize = width / 2;
      ctx.font = fontSize + 'px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
    }
  }
}

document.onkeydown = function(event)
{
  if (!loss)
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
    scoreLabel.innerHTML = 'Score : ' + score;
    countFreeCells();
    if(countFree == 0)
    {
        checkGameLoss();
	}
  }
}

changeSize.onclick = function()
{
    startGame();
}


function finishGame()
{
  canvas.style.opacity = '0.5';
  loss = true;
}

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

function pasteNewCell() {
  countFreeCells();
  
  if(!countFree) {
    finishGame();
    return;
  }

  while(true) {
    var row = Math.floor(Math.random() * boardSize);
    var coll = Math.floor(Math.random() * boardSize);
    if(!cells[row][coll].value) {
      // adds 20% chance to start with 4
      if(Math.ceil(Math.random()*99 > 79)) { 
        cells[row][coll].value = 4;
      } else {
        cells[row][coll].value = 2;
      }
      
      drawAllCells();
      return;
    }
  }
}

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

function checkGameLoss()
{
    loss = true;

    //function addUp()
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

    //function addDown()
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
      
    //function addLeft() 
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

    //function addRight()

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
