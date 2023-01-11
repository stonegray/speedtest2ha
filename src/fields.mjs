export const mqttPath = process.env.MQTT_TOPIC ?? "speedtest"
export const announceRoot = process.env.HA_ANNOUNCE ?? "homeassistant"
export const identifier = "speedtester"

const uidPrefix = "sp0"

// Master list of different sensors and how to get the data:
export const entities = [
    {
        component: "sensor",
        name: "upload",
        homeassistantInfo: {
            name: "Upload Speed",
            state_topic: mqttPath + "/upload",
            device_class: "data_rate",
            unit_of_measurement: "Mbit/s",
            unique_id: uidPrefix + "upload",
            icon: "mdi:cloud-upload-outline"
        },
        backendKey: "upload",

    },
    {
        component: "sensor",
        name: "download",
        homeassistantInfo: {
            name: "Download Speed",
            state_topic: mqttPath + "/download",
            device_class: "data_rate",
            unit_of_measurement: "Mbit/s",
            unique_id: uidPrefix + "download",
            icon: "mdi:cloud-download-outline"
        },
        backendKey: "download"
    },
    {
        component: "sensor",
        name: "ping",
        homeassistantInfo: {
            name: "Ping Time",
            state_topic: mqttPath + "/ping",
            device_class: "duration",
            unit_of_measurement: "milliseconds",
            unique_id: uidPrefix + "ping",
        },
        backendKey: "ping"
    },
    {
        component: "sensor",
        name: "jitter",
        homeassistantInfo: {
            name: "Jitter Time",
            state_topic: mqttPath + "/jitter",
            device_class: "duration",
            unit_of_measurement: "milliseconds",
            unique_id: uidPrefix + "jitter",
            // Not all backends support this:
            enabled_by_default: false
        },
        backendKey: "jitter"
    },
    {
        component: "sensor",
        name: "uploadtotal",
        homeassistantInfo: {
            name: "Upload Bandwidth",
            entity_category: "diagnostic",
            state_topic: mqttPath + "/uploadtotal",
            device_class: "data_size",
            unit_of_measurement: "Mbit",
            unique_id: uidPrefix + "uploadtotal",
            enabled_by_default: true
        },
        backendKey: "upstream"
    },
    {
        component: "sensor",
        name: "downloadtotal",
        homeassistantInfo: {
            name: "Download Bandwidth",
            entity_category: "diagnostic",
            state_topic: mqttPath + "/downloadtotal",
            device_class: "data_size",
            unit_of_measurement: "Mbit",
            unique_id: uidPrefix + "downloadtotal",
            enabled_by_default: true
        },
        backendKey: "downstream"
    },
]
