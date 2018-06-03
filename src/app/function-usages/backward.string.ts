export class BackwardString {
    static backward(str) {
        let odd = '';
        let even = '';
        if (str.length % 2 === 0) {
            odd = str.slice(0, str.length / 2);
            even = str.slice(str.length / 2, str.length);
        } else {
            odd = str.slice(0, Math.floor(str.length / 2));
            even = str.slice(str.length / 2, str.length );
        }
        let decoded = '';
        for (let i = 0; i < even.length; i++) {
            if (i <= odd.length - 1) {
                decoded += even[i];
                decoded += odd[i];
            } else {
                decoded += even[i];
            }
        }
        return decoded;
    }
}
