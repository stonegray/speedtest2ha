
import * as mqtt from 'async-mqtt';

import { entities, mqttPath, announceRoot, identifier } from './fields.mjs';

const options = {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASS,
}

const client = mqtt.connect(process.env.MQTT_HOST ?? 'mqtt://localhost', options)

export const announce_template = {
    platform: "mqtt",
    expire_after: 11 * 60,

    availability_topic: "speedtest/availability",
    availability_mode: "any",
    unique_id: "displa92",

    device: {
        identifiers: identifier,
        name: "Speedtest Connector",
        model: "v1.1",
        manufacturer: "git.io/stonegray",
        identifiers: [
            '39294020'
        ]
    }
}

async function sendHaDiscovery() {

    // For each entity, build the message and send it:
    for (const entity of entities) {

        // Combine the template with the data for this sensor:
        const m = { ...announce_template, ...entity.homeassistantInfo };

        // Annouce topic:
        const announceTopic = `${announceRoot}/${entity.component}/${identifier}_${entity.name}/config`;

        // Broadcast the announce:
        await client.publish(announceTopic, JSON.stringify(m));
    }
}

export async function sendFields(data) {
    console.log("Data", data);
    for (const en of entities) {

        console.log("Processing sensor", en.name, data[en.name], mqttPath + "/" + en.name);
        if (!!data[en.name]) {
            await client.publish(mqttPath + "/" + en.name, "" + data[en.name]);
        } else {
            console.warn("Backend did not provide the following key, skipping:", en.name);
        }
    }

    console.log("Finished updating sensors");
}


client.on('connect', async function () {

    console.log('Connected to MQTT');

    await sendHaDiscovery();

    console.log('Sent discovery to MQTT');
    // Annouce online:
    await client.publish(announce_template.availability_topic, "online");

    setInterval(async () => {
        await client.publish(announce_template.availability_topic, "online");
    }, 10000);

})
