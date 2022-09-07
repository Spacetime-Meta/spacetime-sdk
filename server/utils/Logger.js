class Logger {
    constructor() {
        const P = ['\\', '|', '/', '-'];
        let x = 0;
        const loader = setInterval(() => {
            process.stdout.write(`\r${P[x++]}`);
            x %= P.length;
        }, 250);

        setTimeout(() => {
            clearInterval(loader);
        }, 5000);
    }

    update() {

    }
}