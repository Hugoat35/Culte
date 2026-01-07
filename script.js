// --- script.js ---

const state = {
    players: JSON.parse(localStorage.getItem('culte_players')) || [],
    currentGame: null
};

// Elements DOM
const screens = {
    players: document.getElementById('screen-players'),
    selection: document.getElementById('screen-selection'),
    game: document.getElementById('screen-game')
};
const playersContainer = document.getElementById('players-container');
const playerCountLabel = document.getElementById('player-count-label');
const inputName = document.getElementById('new-player-name');
const btnAdd = document.getElementById('add-player-btn');
const btnToGames = document.getElementById('to-games-btn');
const gameContainer = document.getElementById('game-container');

// --- FONCTIONS JOUEURS ---

function savePlayers() {
    localStorage.setItem('culte_players', JSON.stringify(state.players));
}

function updatePlayerList() {
    playersContainer.innerHTML = '';
    
    if(state.players.length === 0) {
        playersContainer.innerHTML = '<div class="empty-state" style="width:100%; text-align:center; color:white; opacity:0.7; font-style:italic;">Ajoute tes amis pour commencer !</div>';
    }

    state.players.forEach((player, index) => {
        const chip = document.createElement('div');
        chip.className = 'player-chip';
        // Rotation aléatoire légère pour le style
        chip.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg)`;
        chip.innerHTML = `
            ${player}
            <div class="remove" onclick="removePlayer(${index})">×</div>
        `;
        playersContainer.appendChild(chip);
    });

    // Update Footer
    playerCountLabel.innerText = `${state.players.length} Joueur${state.players.length > 1 ? 's' : ''}`;
    
    // Validation (Min 3 joueurs pour Undercover)
    if (state.players.length >= 3) {
        btnToGames.disabled = false;
        btnToGames.innerText = "Choisir un jeu";
    } else {
        btnToGames.disabled = true;
        btnToGames.innerText = `Manque ${3 - state.players.length} joueur(s)`;
    }
}

window.removePlayer = (index) => {
    state.players.splice(index, 1);
    savePlayers();
    updatePlayerList();
};

function addPlayer() {
    const name = inputName.value.trim();
    if (name && !state.players.includes(name)) {
        state.players.push(name);
        savePlayers();
        inputName.value = '';
        updatePlayerList();
        inputName.focus();
    }
}

// Event Listeners
btnAdd.addEventListener('click', addPlayer);
inputName.addEventListener('keypress', (e) => { if(e.key === 'Enter') addPlayer(); });

// --- NAVIGATION ---

function showScreen(screenId) {
    // Cache tout
    Object.values(screens).forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    // Affiche le bon
    const target = document.getElementById(screenId);
    target.classList.remove('hidden');
    target.classList.add('active');
}

// Bouton "Commencer"
btnToGames.addEventListener('click', () => showScreen('screen-selection'));

// Boutons Retour
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const targetId = e.currentTarget.dataset.target;
        showScreen(targetId);
    });
});

// Quitter le jeu
document.getElementById('quit-game-btn').addEventListener('click', () => {
    if(confirm("Quitter la partie en cours ?")) {
        gameContainer.innerHTML = '';
        state.currentGame = null;
        showScreen('screen-selection');
    }
});

// --- LANCEMENT DES JEUX ---

document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', async () => {
        if (card.classList.contains('disabled')) return;

        const gameName = card.dataset.game;
        try {
            // Import dynamique
            const module = await import(`./modes/${gameName}/logic.js`);
            
            showScreen('screen-game');
            
            // Nettoyage conteneur
            gameContainer.innerHTML = '';
            
            // Instanciation
            state.currentGame = new module.default(state.players, gameContainer);
            state.currentGame.start();

        } catch (err) {
            console.error(err);
            alert("Erreur chargement du jeu");
        }
    });
});

// Init
updatePlayerList();