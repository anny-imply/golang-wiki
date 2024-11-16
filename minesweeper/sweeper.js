document.getElementById("again").addEventListener("click", () => {
  reset();
});

const container = document.getElementById("grid");
const gameOverTextElem = document.getElementById("gameOver");

const getRandomIntInclusive = (min, max) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
};
const getNormalOrBomb = () => getRandomIntInclusive(0, 2);

// num is either 2 for bomb, or 0 to negative for normal
const checkCell = (cell) => {
  // do nothing if cell has already been clicked
  if (!cell.classList.contains("covered")) return;
  cell.classList.remove("covered");
  if (!cell.textContent) {
    cell.classList.add("bomb");
    endGame(false);
  } else {
    cell.classList.add("expose");
  }

  // win iff when the covered cells are all bombs
  if (
    Array.from(document.querySelectorAll(".covered")).every(
      (c) => c.textContent === ""
    )
  ) {
    endGame(true);
  }
};

const getUpdatedNum = ({ num, grid, rowIndex, colIndex }) => {
  if (num === 2) return num;
  // regular
  num = 0;
  // compute nearby bombs
  if (rowIndex > 0 && grid[rowIndex - 1][colIndex] === 2) {
    num -= 1;
  }

  if (rowIndex + 1 < grid.length && grid[rowIndex + 1][colIndex] === 2) {
    num -= 1;
  }

  if (colIndex > 0 && grid[rowIndex][colIndex - 1] === 2) {
    num -= 1;
  }

  if (colIndex + 1 < grid[0].length && grid[rowIndex][colIndex + 1] === 2) {
    num -= 1;
  }

  // diagonals
  if (rowIndex > 0 && colIndex > 0 && grid[rowIndex - 1][colIndex - 1] === 2) {
    num -= 1;
  }

  if (
    colIndex + 1 < grid[0].length &&
    rowIndex + 1 < grid.length &&
    grid[rowIndex + 1][colIndex + 1] === 2
  ) {
    num -= 1;
  }

  if (
    colIndex + 1 < grid[0].length &&
    rowIndex > 0 &&
    grid[rowIndex - 1][colIndex + 1] === 2
  ) {
    num -= 1;
  }

  if (
    rowIndex + 1 < grid.length &&
    colIndex > 0 &&
    grid[rowIndex + 1][colIndex - 1] === 2
  ) {
    num -= 1;
  }
  return num;
};

const createBoard = () => {
  container.innerHTML = "";
  const grid = new Array(5).fill(0).map(() => new Array(5).fill(0));
  // 0, 1 is regular,  2 is bomb

  const values = new Set();
  grid.forEach((row, index) => {
    row.forEach(() => {
      let newVal = getNormalOrBomb();
      while (values.has(newVal)) {
        newVal = getNormalOrBomb();
      }
      row[index] = newVal;
    });
  });
  grid.forEach((row, rowIndex) => {
    const rowElem = document.createElement("div");
    rowElem.classList.add("row");
    row.forEach((num, colIndex) => {
      const cellElem = document.createElement("div");
      const updatedNum = getUpdatedNum({
        num,
        grid,
        rowIndex,
        colIndex,
      });
      // normal cells have number, bomb does not
      if (updatedNum !== 2) {
        cellElem.textContent = updatedNum;
        grid[rowIndex][colIndex] = updatedNum;
      }
      cellElem.addEventListener("click", (e) => {
        checkCell(e.target);
        if (updatedNum === 0) {
          let rowI = rowIndex - 1;
          while (rowI > 0 && grid[rowI][colIndex] === 0) {
            const neighbor =
              document.querySelectorAll(".row")[rowI].childNodes[colIndex];
            checkCell(neighbor);
            rowI--;
          }
          rowI = rowIndex + 1;
          while (rowI < grid.length && grid[rowI][colIndex] === 0) {
            const neighbor =
              document.querySelectorAll(".row")[rowI].childNodes[colIndex];
            checkCell(neighbor);
            rowI++;
          }
        }
      });
      cellElem.classList.add("cell");

      cellElem.classList.add("covered");
      rowElem.appendChild(cellElem);
    });
    container.appendChild(rowElem);
  });
};

const endGame = (didWin) => {
  container.classList.add("disable");
  gameOverTextElem.parentElement.classList.remove("hide");
  gameOverTextElem.textContent = didWin ? "YOU WON :)" : "YOU LOST :(";
};
const reset = () => {
  createBoard();
  gameOverTextElem.parentElement.classList.add("hide");
  container.classList.remove("disable");
};

reset();
