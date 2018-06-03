export class ForwardString {
    static forward(str) {
        const txt = str;
        let odd = '';
        let even = '';
        for ( let i = 0; i < txt.length; i++){
            if (i % 2 === 0) {
                even += txt[i];
            } else {
                odd += txt[i];
            }
        }
        const encoded = odd + even;
        return encoded;
    }
}
