import { speedtest } from "./backendSpeedtest.mjs";
import { entities, mqttPath } from "./fields.mjs";
import { sendFields } from "./mqtt.mjs";
import * as cron from 'node-cron';

// Store total bandwidth:
const counters = {
    uploadtotal: 1,
    downloadtotal: 1,
    total: 1
}


async function runTest() {

    console.log("Starting test...");
    // Get all the info from the testing backend:
    const results = await speedtest(
        process.env.SPEEDTEST_SERVER_ID,
        process.env.SPEEDTEST_EXCLUDE_ID,
        process.env.SPEEDTEST_SINGLE_MODE
    );

    console.log("Sending data...")
    sendFields(results);

    // Calculate totals:
    if (results.bytes_sent > 1) counters.uploadtotal += results.bytes_sent;
    if (results.bytes_recieved > 1) counters.downnstream += results.bytes_recieved;
    counters.total = counters.uploadtotal + counters.downloadtotal;

    console.log(counters);
    sendFields(counters);

}

await runTest();

cron.schedule(process.env.CRON ?? '* */1 * * *', async () => {
    await runTest();
});

// Default monthly:
cron.schedule(process.env.COUNTER_RESET ?? '0 0 29 2 1', async () => {
    counters.downloadtotal = 0;
    counters.uploadtotal = 0;
});

