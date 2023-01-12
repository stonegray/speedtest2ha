import * as cron from 'node-cron';

import { entities, mqttPath } from "./fields.mjs";
import { sendFields } from "./mqtt.mjs";
import { speedtest } from "./backendSpeedtest.mjs";
import { speedtestFast } from './backendFast.mjs';

// Store total bandwidth:
const counters = {
    uploadtotal: 0,
    downloadtotal: 0,
    total: 0
}

async function runTest() {

    console.log("Starting test...");
    // Get all the info from the testing backend:

    sendFields({ testinprogress: "true" });

    let results;
    if (process.env.SPEEDTEST_BACKEND_FAST) {
        results = await speedtestFast();
    } else {
        results = await speedtest(
            process.env.SPEEDTEST_SERVER_ID,
            process.env.SPEEDTEST_EXCLUDE_ID,
            process.env.SPEEDTEST_SINGLE_MODE
        );
    }
    sendFields({ testinprogress: "false" });

    console.log("Sending data...")

    // Calculate totals:
    if (results.bytes_sent > 1) counters.uploadtotal += results.bytes_sent;
    if (results.bytes_recieved > 1) counters.downnstream += results.bytes_recieved;
    counters.total = counters.uploadtotal + counters.downloadtotal;

    sendFields(results);

}

if (!process.env.NO_TEST_ON_STARTUP)
    await runTest();

cron.schedule(process.env.CRON ?? '* */1 * * *', async () => {
    await runTest();
});

cron.schedule(process.env.COUNTER_RESET ?? '0 0 29 2 1', async () => {
    counters.downloadtotal = 0;
    counters.uploadtotal = 0;
});

