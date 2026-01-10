/* modes/palmier/logic.js */
import { getRule } from './data.js';

export default class PalmierGame {
    constructor(players, container) {
        this.players = players;
        this.container = container;
        this.deck = [];
        this.currentCard = null;
        this.isAnimating = false; 
    }

    start() {
        this.buildDeck();
        this.showTable();
    }

    buildDeck() {
        const suits = [
            { symbol: '♥', color: 'red' },
            { symbol: '♦', color: 'red' },
            { symbol: '♠', color: 'black' },
            { symbol: '♣', color: 'black' }
        ];
        
        for (let i = 1; i <= 13; i++) {
            suits.forEach(suit => {
                let display = i;
                if (i === 1) display = 'A';
                else if (i === 11) display = 'V';
                else if (i === 12) display = 'D';
                else if (i === 13) display = 'R';

                this.deck.push({
                    value: i,
                    suit: suit.symbol,
                    color: suit.color,
                    displayValue: display
                });
            });
        }
        
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    showTable() {
        this.container.innerHTML = `
            <div style="font-size:3em; margin-bottom:5px;">🌴</div>
            <h2>Le Palmier</h2>
            
            <p id="deck-counter" style="margin-bottom:5px; color:#888;">${this.deck.length} cartes restantes</p>
            <p id="instruction" class="instruction-text">Touchez la carte pour commencer</p>

            <div class="card-scene">
                <div class="card-object" id="active-card">
                    <div class="card-face card-back">
                        <div class="pattern">🌴</div>
                    </div>
                    <div class="card-face card-front">
                        </div>
                </div>
            </div>

            <div id="rule-display" class="rule-box visible">
                <p id="rule-text" style="color:#aaa; font-style:italic;">Les règles du jeu s'afficheront ici.</p>
            </div>
        `;

        this.container.querySelector('#active-card').onclick = () => this.drawCard();
    }

    drawCard() {
        if (this.isAnimating) return;
        if (this.deck.length === 0) {
            this.endGame();
            return;
        }

        this.isAnimating = true;

        const card = this.deck.pop();
        const cardEl = document.getElementById('active-card');
        const frontEl = cardEl.querySelector('.card-front');
        const ruleBox = document.getElementById('rule-display');
        const ruleText = document.getElementById('rule-text');
        const instruction = document.getElementById('instruction');
        const counter = document.getElementById('deck-counter');

        if (instruction) instruction.innerText = "Touchez pour la suivante";

        // 1. On cache le texte actuel (Fade Out)
        ruleBox.classList.remove('visible'); // Le bloc devient transparent
        cardEl.classList.remove('flipped');

        setTimeout(() => {
            // Mise à jour de la carte (invisible)
            frontEl.className = `card-face card-front ${card.color}`;
            frontEl.innerHTML = `
                <div class="card-corner top-left">
                    <span>${card.displayValue}</span><span>${card.suit}</span>
                </div>
                <div class="card-center">${card.suit}</div>
                <div class="card-corner bottom-right">
                    <span>${card.displayValue}</span><span>${card.suit}</span>
                </div>
            `;

            void cardEl.offsetWidth; 

            // Ouverture de la carte
            cardEl.classList.add('flipped');

            setTimeout(() => {
                // Mise à jour du texte
                const rule = getRule(card.value, card.color);
                ruleText.innerHTML = rule;
                // On remet le style normal (pas italique/gris)
                ruleText.style.color = ""; 
                ruleText.style.fontStyle = "";

                // Réapparition du bloc (Fade In)
                ruleBox.classList.remove('hidden'); // Sécurité
                requestAnimationFrame(() => {
                    ruleBox.classList.add('visible');
                });
                
                counter.innerText = `${this.deck.length} cartes restantes`;
                this.isAnimating = false;

            }, 600);

        }, 450);
    }

    endGame() {
        this.container.innerHTML = `
            <h2>Plus de cartes !</h2>
            <p>Le paquet est vide.</p>
            <button class="main-btn" onclick="window.returnToSelection()">Retour Menu</button>
        `;
    }
}