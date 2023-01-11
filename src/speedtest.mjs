import { speedtest } from "./backendSpeedtest.mjs";
import { entities, mqttPath } from "./fields.mjs";
import { sendFields } from "./mqtt.mjs";
import * as cron from 'node-cron';

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

}

await runTest();


cron.schedule('*/10 * * * *', async () => {
    await runTest();
});


