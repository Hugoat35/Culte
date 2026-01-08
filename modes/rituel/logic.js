// Importation des sous-jeux
import NeverGame from './cards/never/logic.js';
import LikelyGame from './cards/likely/logic.js';
import MiscGame from './cards/misc/logic.js';
import VirusGame from './cards/virus/logic.js';

export default class RituelGame {
    constructor(players, container) {
        this.players = players;
        this.container = container;
        this.deck = [];
        this.currentIndex = 0;
    }

    start() {
        // 1. Activer le mode paysage forcé
        this.container.classList.add('force-landscape');
        
        // 2. Construire le paquet de cartes
        this.buildDeck();
        
        // 3. Afficher la première carte
        this.showCurrentCard();

        // 4. Ajouter l'événement "Tap to next" sur tout le conteneur
        // On utilise bind(this) pour garder le contexte
        this.handleClick = this.nextCard.bind(this);
        this.container.addEventListener('click', this.handleClick);
    }

    buildDeck() {
        // On récupère les cartes générées par chaque sous-module
        const neverCards = new NeverGame().getCards();
        const likelyCards = new LikelyGame(this.players).getCards(); // Besoin des joueurs pour "Qui pourrait"
        const miscCards = new MiscGame(this.players).getCards();
        const virusCards = new VirusGame().getCards();

        // On fusionne tout
        this.deck = [
            ...neverCards,
            ...likelyCards,
            ...miscCards,
            ...virusCards
        ];

        // Mélange (Fisher-Yates)
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    showCurrentCard() {
        // Si plus de cartes, on finit
        if (this.currentIndex >= this.deck.length) {
            this.container.innerHTML = `
                <div class="rituel-card">
                    <h1>Fin de la partie !</h1>
                    <p>Touchez pour quitter</p>
                </div>
            `;
            // Le prochain clic quittera
            this.currentIndex++; 
            return;
        }

        const card = this.deck[this.currentIndex];
        
        // On injecte le HTML de la carte
        this.container.innerHTML = card.html;
        
        // On ajoute le petit texte "Tap"
        this.container.innerHTML += `<div class="tap-hint">Touchez l'écran</div>`;
    }

    nextCard() {
        // Si on a dépassé la fin (écran de fin affiché), on quitte
        if (this.currentIndex > this.deck.length) {
            this.cleanup();
            // On simule le clic sur le bouton quitter global ou on recharge
            document.getElementById('quit-game-btn').click();
            return;
        }

        this.currentIndex++;
        this.showCurrentCard();
    }

    cleanup() {
        // IMPORTANT : On retire la rotation quand on quitte
        this.container.classList.remove('force-landscape');
        this.container.removeEventListener('click', this.handleClick);
    }
}