import FastSpeedtest from 'fast-speedtest-api';

async function getFastToken() {
    const response = await fetch('https://fast.com/app-ed402d.js');

    const data = await response.text();

    let token = data.match(/token:"(.{32})"/)[1];

    console.log("Recieved API token: ", token);

    return token;
}

export async function speedtestFast() {

    const token = await getFastToken();

    let speedtest = new FastSpeedtest({
        token: token, // required
        verbose: false, // default: false
        timeout: 10000, // default: 5000
        https: true, // default: true
        urlCount: 5, // default: 5
        bufferSize: 8, // default: 8
    });

    return new Promise((resolveFunc) => {
        speedtest.getSpeed().then(s => {
            resolveFunc({
                error: false,
                download: ~~(s / 1e4) / 1e2
            });
        }).catch(e => {
            resolveFunc({
                error: true,
                message: e.message
            });
        });
    });
}
