export class RandomString {
    static randomText() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ$abcdefghijklmnopqrstuvwxyz_0123456789';
        for (let i = 0; i < 50; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
