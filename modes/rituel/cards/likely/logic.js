import { data } from './data.js';

export default class LikelyGame {
    constructor(players) {
        this.players = players || [];
    }

    getCards() {
        return data.map(text => {
            return {
                type: 'likely',
                html: `
                    <div class="rituel-card">
                        <div class="rituel-category" style="color:#54a0ff">Qui pourrait...</div>
                        <div class="rituel-content">${text}</div>
                        <p style="margin-top:20px; font-size:0.8em; opacity:0.6;">Pointez la personne du doigt au compte de 3</p>
                    </div>
                `
            };
        });
    }
}