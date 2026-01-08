import { data } from './data.js';

export default class NeverGame {
    getCards() {
        return data.map(text => {
            return {
                type: 'never',
                html: `
                    <div class="rituel-card">
                        <div class="rituel-category" style="color:#ff6b6b">Je n'ai jamais</div>
                        <div class="rituel-content">${text}</div>
                        <p style="margin-top:20px; font-size:0.8em; opacity:0.6;">Buvez si vous l'avez fait</p>
                    </div>
                `
            };
        });
    }
}