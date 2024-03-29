# speedtest2ha

![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/stonegray/speedtest2ha/build.yaml?branch=main) ![GitHub](https://img.shields.io/github/license/stonegray/speedtest2ha) ![Docker Pulls](https://img.shields.io/docker/pulls/stonegray/speedtest2ha) ![](https://img.shields.io/badge/arch-arm64%20%7C%20amd64-blue) ![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/stonegray/speedtest2ha)

Supports Autodiscovery, no configuration is required in Home Assistant. 

<p align="center">
<img src="https://github.com/stonegray/speedtest2ha/blob/main/.github/images/screenshot.png?raw=true" width="75%">
</p>

## Installation:

Using `docker-compose.yml`:

```yml
version: "3"
services:
  speedtest:
    image: stonegray/speedtest2ha:main
    container_name: speedtest2ha
    environment:
      - MQTT_HOST=mqtt://192.168.1.4
      - MQTT_USER=AzureDiamond
      - MQTT_PASS=hunter2
    restart: unless-stopped
```

## Enviroment Variables

Settings you probably need to change:
- `MQTT_HOST`: FQDN or URL of the MQTT server. The default is "mqtt://127.0.0.1". Supports WebSocket connections. You must specify a protocol. 
- `MQTT_TOPIC`: Default `speedtest`
- `MQTT_USER` / `MQTT_PASS`: Credentials for the MQTT server.

Settings you probably don't need to change:

<!--- `PERIOD`: Ignored if `CRON` is set. Number of seconds between tests. Must be greater than 300.-->
<!--- `MQTT_NO_LAST_WILL`: Disable MQTT last will.-->
- `CRON`: Defaults to "0 0,6,12,18 * * *". This updates four times per day.
- `SPEEDTEST_BACKEND_FAST`: Use the experimental Fast.com API. Currently does not report upload speed.
- `SPEEDTEST_SERVER_ID`: Defaults to automatic. Set to the integer server ID (eg. 12345) to skip server selection and force connecting so a specific ID.
- `SPEEDTEST_SERVER_EXCLUDE`: Defaults to none. Set to an integer server ID to ignore this server during selection. 
- `SPEEDTEST_SINGLE_MODE`: Use a single thread; may measure actual file transfer performance from a single host better. Equilvilent to `--single` on `speedtest-cli`
- `HA_ANNOUNCE`: Topic to send annoucements. Defaults to `homeassistant`.
- `HA_ANNOUNCE_NAME`: Device name for Home Assistant. Defaults to "Speedtest Connector"
- `MQTT_CLIENT_ID`: Client ID. Defaults to an autogenerated ID.
- `MQTT_USE_V5`: Set to use MQTT v5. Defaults to v4.
- `TRAFFIC_COUNTER_RESET`: Cron syntax to reset the bandwidth counters. Defaults to approximately never (0 0 29 2 1). This may be useful to reset monthly to determine impact of speedtesting on your traffic allowances, eg `TRAFFIC_COUNTER_RESET="0 0 1 * *"`
- `AVAILABILITY_UPDATE_RATE`: Number of seconds to wait between availability updates. Default 3600.
- `NO_TEST_ON_BOOT`: Disable testing on boot and only use the cron scheduled tests. This will show "Unavailable" in home assistant until data updates, but may prevent unexpected timing after updates.

## Running without Docker

It's strongly recommended to use Docker. To run without, just set the required
enviroment variables and run `src/speedtest.mjs`:

```bash
MQTT_HOST=mqtt://10.0.0.10 node src/speedtest.mjs
```

You may wish to daemonize this using PM2 or similar software. 

## Topics

By default, the following topics are used. They will automatically be added to HA:

- Sensors: `speedtest/upload`,`speedtest/download`,`speedtest/ping`,`speedtest/jitter`,`speedtest/uploadtotal`,`speedtest/downloadtotal`,`speedtest/availability`
