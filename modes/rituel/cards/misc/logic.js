import { data } from './data.js';

export default class MiscGame {
    constructor(players) {
        this.players = players || [];
    }

    getCards() {
        return data.map(text => {
            return {
                type: 'misc',
                html: `
                    <div class="rituel-card">
                        <div class="rituel-category" style="color:#feca57">Action / Chance</div>
                        <div class="rituel-content">${text}</div>
                    </div>
                `
            };
        });
    }
}