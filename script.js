// ----------------------
// DONNÉES (V1 simple)
// ----------------------
const cards = [
  "{player} boit 2 gorgées 🍺",
  "Tout le monde boit 1 gorgée 🥂",
  "{player} fait un compliment à quelqu’un.",
  "{player} raconte une anecdote gênante 😳",
  "Le dernier à toucher son nez boit 2 gorgées 👃",
  "{player} choisit quelqu’un : il boit 2 gorgées.",
  "Tout le monde lève son verre : santé ! 🍻",
  "{player} imite une célébrité pendant 10 secondes 🎭",
  "Le plus grand boit 1 gorgée 🧍‍♂️",
  "{player} invente une règle jusqu’à la prochaine carte 📜"
];

const state = {
  players: []
};

// ----------------------
// DOM
// ----------------------
const setupScreen = document.getElementById("screen-setup");
const gameScreen = document.getElementById("screen-game");

const playerInput = document.getElementById("playerInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");
const playersList = document.getElementById("playersList");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const gameCard = document.getElementById("gameCard");
const cardText = document.getElementById("cardText");
const backBtn = document.getElementById("backBtn");

// ----------------------
// HELPERS
// ----------------------
function renderPlayers() {
  playersList.innerHTML = "";
  state.players.forEach((name, idx) => {
    const li = document.createElement("li");
    li.textContent = name;

    const remove = document.createElement("button");
    remove.textContent = "×";
    remove.title = "Supprimer";
    remove.addEventListener("click", () => {
      state.players.splice(idx, 1);
      renderPlayers();
      startBtn.disabled = state.players.length < 2;
    });

    li.appendChild(remove);
    playersList.appendChild(li);
  });
}

function normalizeName(raw) {
  return raw.trim().replace(/\s+/g, " ");
}

function getRandomPlayer() {
  const i = Math.floor(Math.random() * state.players.length);
  return state.players[i];
}

function getRandomCardText() {
  const template = cards[Math.floor(Math.random() * cards.length)];
  const player = getRandomPlayer();
  return template.replaceAll("{player}", player);
}

function showScreen(which) {
  setupScreen.classList.toggle("active", which === "setup");
  gameScreen.classList.toggle("active", which === "game");
}

function showNextCard() {
  cardText.textContent = getRandomCardText();
}

// (Optionnel) tentative de lock paysage (marche pas partout sur mobile)
async function tryLockLandscape() {
  try {
    if (screen.orientation && screen.orientation.lock) {
      await screen.orientation.lock("landscape");
    }
  } catch (_) {}
}

// ----------------------
// EVENTS
// ----------------------
addPlayerBtn.addEventListener("click", () => {
  const name = normalizeName(playerInput.value);
  if (!name) return;

  // évite les doublons exacts
  if (state.players.some(p => p.toLowerCase() === name.toLowerCase())) {
    playerInput.value = "";
    playerInput.focus();
    return;
  }

  state.players.push(name);
  playerInput.value = "";
  playerInput.focus();

  renderPlayers();
  startBtn.disabled = state.players.length < 2;
});

playerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayerBtn.click();
});

resetBtn.addEventListener("click", () => {
  state.players = [];
  renderPlayers();
  startBtn.disabled = true;
  playerInput.value = "";
  playerInput.focus();
});

startBtn.addEventListener("click", async () => {
  await tryLockLandscape();
  showScreen("game");
  showNextCard();
});

// Tap/click sur la carte => suivante
gameCard.addEventListener("click", () => {
  showNextCard();
});

backBtn.addEventListener("click", () => {
  showScreen("setup");
});

// init
renderPlayers();
startBtn.disabled = true;
