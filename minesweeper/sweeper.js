document.getElementById("again").addEventListener("click", () => {
  reset();
});

const container = document.getElementById("grid");
const setLifeCount = (count) => {
  document.getElementById("lifeCount").textContent = count;
};

const createBoard = () => {
  container.innerHTML = "";
  let lifeCount = 1;
  setLifeCount(lifeCount);
  const grid = new Array(5).fill(0).map(() => new Array(5).fill(0));
  // 0, 1 is regular,  2 is bomb, 3 is boon
  const getBoonOrBomb = () => getRandomIntInclusive(0, 3);

  function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
  }

  const values = new Set();
  grid.forEach((row) => {
    const rowElem = document.createElement("div");
    row.forEach(() => {
      const cellElem = document.createElement("div");
      cellElem.addEventListener("click", () => {
        // do nothing if cell has already been clicked
        if (!cellElem.classList.contains("covered")) return;
        cellElem.classList.remove("covered");
        if (newVal === 0 || newVal === 1) {
          cellElem.classList.add("expose");
        } else if (newVal === 2) {
          lifeCount += 1;
          setLifeCount(lifeCount);
          cellElem.classList.add("boon");
        } else if (newVal === 3) {
          lifeCount -= 1;
          setLifeCount(lifeCount);
          if (lifeCount === 0) {
            endGame();
          }
          cellElem.classList.add("bomb");
        }
        if (document.querySelectorAll(".covered").length === 0) {
          endGame(true);
        }
      });
      cellElem.classList.add("cell");
      cellElem.classList.add("covered");
      let newVal = getBoonOrBomb();
      while (values.has(newVal)) {
        newVal = getBoonOrBomb();
      }
      rowElem.appendChild(cellElem);
    });
    container.appendChild(rowElem);
  });
};

const endGame = (didWin) => {
  container.classList.add("disable");
  document.getElementById("gameOver").parentElement.classList.remove("hide");
  document.getElementById("gameOver").textContent = didWin
    ? "YOU WON :)"
    : "YOU LOST :(";
  document.getElementById("gameOver").classList.remove("hide");
};
const reset = () => {
  createBoard();
  document.getElementById("gameOver").parentElement.classList.add("hide");
  document.getElementById("grid").classList.remove("disable");
};

reset();
