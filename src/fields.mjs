
const uidPrefix = "sp0"

export const announceRoot = process.env.HA_ANNOUNCE ?? "homeassistant"
export const identifier = "speedtester"
export const mqttPath = process.env.MQTT_TOPIC ?? "speedtest"

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
            unit_of_measurement: "seconds",
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
        backendKey: "uploadtotal"
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
        backendKey: "downloadtotal"
    },
    {
        component: "binary_sensor",
        name: "testinprogress",
        homeassistantInfo: {
            name: "Test In Progress",
            state_topic: mqttPath + "/testinprogress",
            device_class: "running",
            unique_id: uidPrefix + "testinprogress",
            payload_on: "true",
            payload_off: "false"
        },
        backendKey: "testinprogress"
    },
    {
        component: "button",
        name: "runtest",
        homeassistantInfo: {
            name: "Manual Update",
            state_topic: mqttPath + "/runtest",
            command_topic: mqttPath + "/runtest/set",
            device_class: "restart",
            unique_id: uidPrefix + "runtest",
            payload_on: "true",
            payload_off: "false"
        },
        backendKey: "runtest"
    },
    {
        component: "switch",
        name: "schedule",
        homeassistantInfo: {
            name: "Scheduled Updates",
            state_topic: mqttPath + "/schedule",
            command_topic: mqttPath + "/schedule/set",
            device_class: "switch",
            unique_id: uidPrefix + "schedule",
            payload_on: "true",
            payload_off: "false",
            enabled_by_default: false
        },
        backendKey: "schedule"
    },
]
