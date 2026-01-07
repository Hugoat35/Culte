import { words } from './data.js';

export default class UndercoverGame {
    constructor(players, container) {
        this.players = players; // Liste des noms
        this.container = container; // Élément HTML où afficher le jeu
        this.currentPlayerIndex = 0;
        this.gameData = null;
        this.assignments = [];
    }

    start() {
        this.setupGame();
        this.showPassPhoneScreen();
    }

    setupGame() {
        // 1. Choisir des mots
        const pair = words[Math.floor(Math.random() * words.length)];
        
        // 2. Définir les rôles (1 Undercover pour commencer simple)
        const undercoverIndex = Math.floor(Math.random() * this.players.length);
        
        // 3. Assigner les mots à chaque joueur
        this.assignments = this.players.map((player, index) => {
            return {
                name: player,
                role: index === undercoverIndex ? 'Undercover' : 'Civil',
                word: index === undercoverIndex ? pair.undercover : pair.civil
            };
        });

        // Mélanger l'ordre de passage si on veut, ici on garde l'ordre de la liste
    }

    // Affiche l'écran "Passe le téléphone à..."
    showPassPhoneScreen() {
        if (this.currentPlayerIndex >= this.assignments.length) {
            this.showEndDistribution();
            return;
        }

        const player = this.assignments[this.currentPlayerIndex];
        
        this.container.innerHTML = `
            <h2>Au tour de <br><strong style="font-size:1.5em; color:var(--accent-color)">${player.name}</strong></h2>
            <p>Passe le téléphone à ${player.name} et assure-toi que personne ne regarde.</p>
            <button id="reveal-btn" class="main-btn" style="margin-top:20px">Voir mon mot secret</button>
        `;

        this.container.querySelector('#reveal-btn').onclick = () => this.showSecretScreen(player);
    }

    // Affiche le mot secret
    showSecretScreen(player) {
        this.container.innerHTML = `
            <h2>Ton mot secret est :</h2>
            <div style="
                font-size: 2.5em; 
                font-weight: bold; 
                margin: 40px 0; 
                padding: 20px; 
                border: 2px dashed #ccc; 
                border-radius: 15px;">
                ${player.word}
            </div>
            <p>Mémorise-le et clique pour cacher.</p>
            <button id="hide-btn" class="main-btn">C'est bon, j'ai vu</button>
        `;

        this.container.querySelector('#hide-btn').onclick = () => {
            this.currentPlayerIndex++;
            this.showPassPhoneScreen();
        };
    }

    // Fin de la distribution
    showEndDistribution() {
        this.container.innerHTML = `
            <div style="font-size:3em">🗣️</div>
            <h2>Débattez !</h2>
            <p>Tout le monde a son mot.</p>
            <p>Discutez et votez pour éliminer l'Undercover.</p>
            
            <div style="margin-top: 30px; background: #fff3cd; padding: 15px; border-radius: 10px; font-size: 0.9em;">
                <em>Astuce : Le joueur qui commence est ${this.assignments[Math.floor(Math.random() * this.assignments.length)].name}</em>
            </div>

            <button id="reveal-roles-btn" class="main-btn" style="background:#333; color:white; margin-top:30px">Révéler les rôles</button>
        `;

        this.container.querySelector('#reveal-roles-btn').onclick = () => this.revealRoles();
    }

    revealRoles() {
        let html = `<h2>Résultats</h2><ul style="text-align:left; list-style:none; width:100%">`;
        
        this.assignments.forEach(p => {
            const color = p.role === 'Undercover' ? 'red' : 'green';
            html += `
                <li style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;">
                    <span>${p.name}</span>
                    <strong style="color:${color}">${p.role} (${p.word})</strong>
                </li>
            `;
        });
        html += `</ul>`;
        
        // Bouton Rejouer
        html += `<button id="replay-btn" class="main-btn" style="margin-top:20px">Rejouer</button>`;
        
        this.container.innerHTML = html;
        
        this.container.querySelector('#replay-btn').onclick = () => {
             this.currentPlayerIndex = 0;
             this.start();
        };
    }
}