//* -----------------------
//* FASE DI PREPARAZIONE
//* -----------------------

// Raccogliamo tutti gli elementi di nostro interesse dalla pagina
const grid = document.querySelector('.grid');
const stackBtn = document.querySelector('.stack');
const scoreCounter = document.querySelector('.score-counter');
const endGameScreen = document.querySelector('.end-game-screen');
const endGameText = document.querySelector('.end-game-text');
const playAgainButton = document.querySelector('.play-again');

// Creiamo la matrice per la nostra griglia
// 0 - grid
// 1 - bar
const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0]
];

// Prepariamo delle informazioni necessarie alla logia di gioco
let currentRowIndex = gridMatrix.length - 1;
let barDirection = 'right';
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;


function draw () {
  grid.innerHTML = '';

  gridMatrix.forEach(function (rowContent, rowIndex) {
    rowContent.forEach(function (cellContent, cellIndex) {
      // Creiamo una cella
      const cell = document.createElement('div');
      cell.classList.add('cell');

      // Stile scacchiera
      const isRowEven = rowIndex % 2 === 0;
      const isCellEven = cellIndex % 2 === 0;

      if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
        cell.classList.add('cell-dark');
      }

      // La cella è parte della barra
      if (cellContent === 1) {
        cell.classList.add('bar');
      }

      // Inseriamola nella griglia
      grid.appendChild(cell);
    });
  });
}

function moveRight (row) {
  row.pop();
  row.unshift(0);
}

function moveLeft (row) {
  row.shift();
  row.push(0);
}

function isRightEdge (row) {
  const lastElement = row[row.length - 1];
  return lastElement === 1;
}

function isLeftEdge (row) {
  const firstElement = row[0];
  return firstElement === 1;
}

function moveBar () {
  const currentRow = gridMatrix[currentRowIndex];

  if (barDirection === 'right') {
    moveRight(currentRow);
    if (isRightEdge(currentRow)) {
      barDirection = 'left';
    }
  } else if (barDirection === 'left') {
    moveLeft(currentRow);
    if (isLeftEdge(currentRow)) {
      barDirection = 'right';
    }
  }
}


function checkLost () {
  // salvo in variabile un riferimento
  // alla riga corrente e alla riga precedente
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];

  // se non esiste una riga precedente (inizio gioco)
  // allo esco dalla funzione
  if (!prevRow) return;

  // controllo se sotto ogni elemento della barra
  // esiste almeno un elemento dello stack accumulato
  for (let i = 0; i < currentRow.length; i++) {
    // se sotto un elemento della barra
    // non c'è un elemento dello stack accumulato
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      // rimuovo il pezzo della barra
      // e la accorcio di un elemento
      currentRow[i] = 0;
      barSize--;

      // se la barra non ha più elementi
      // hai perso il gioco!
      if (barSize === 0) {
        isGameOver = true;
        clearInterval(t);
        endGame(false);
      }
    }
  }
}

function checkWin () {
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(t);
    endGame(true);
  }
}

function onStack () {
  // controllo se ho vinto o perso
  checkLost();
  checkWin();

  // ho finito il gioco?
  if (isGameOver) return;

  // aggiorno il punteggio
  updateScore();

  // cambio riga corrente
  // e riparto dalla prima colonna
  currentRowIndex = currentRowIndex - 1;
  barDirection = 'right';
  
  // disegno la barra
  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

function updateScore () {
  score++;
  scoreCounter.innerText = String(score).padStart(5, '0');

  // punteggio basato sui blocchi rimanenti
  // const finalBlock = document.querySelectorAll('.bar');
  // scoreCounter.innerText = finalBlock.length.toString().padStart(5, '0');
}

// Funzione per il gameover
function endGame(isVictory) {
  if (isVictory) {
    endGameText.innerHTML = 'YOU<br>WON';
    endGameScreen.classList.add('win');
  }

  endGameScreen.classList.remove('hidden');
}

function onPlayAgain () {
  location.reload();
}


function main () {
  moveBar();
  draw();
}

// Events
stackBtn.addEventListener('click', onStack);
playAgainButton.addEventListener('click', onPlayAgain);

// First draw
draw();

// Start game Loop
t = setInterval(main, 600);

