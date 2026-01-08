import { data } from './data.js';

export default class VirusGame {
    getCards() {
        return data.map(text => {
            return {
                type: 'virus',
                html: `
                    <div class="rituel-card rituel-virus">
                        <div class="rituel-category" style="color:#4cd137">🦠 VIRUS</div>
                        <div class="rituel-content">${text}</div>
                    </div>
                `
            };
        });
    }
}