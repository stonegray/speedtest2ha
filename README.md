# speedtest2ha
Speedtest results in Home Assistant via MQTT.

Supports Autodiscovery, no configuration is required in Home Assistant.

## Examples

Using `docker-compose.yml`:
```yml
version: "3"

services:

  speedtest:
    image: stonegray/speedtest2ha:latest
    container_name: speedtest2ha
    environment:
      - MQTT_HOST=192.168.1.4
      - MQTT_USER=AzureDiamond
      - MQTT_PASS=hunter2
    restart: unless-stopped
```

## Enviroment Variables

Settings you probably need to change:
- `MQTT_HOST`: FQDN or URL of the MQTT server. The default is "mqtt://127.0.0.1". Supports WebSocket connections.
- `MQTT_TOPIC`: Default `speedtest/speedtester`
- `MQTT_USER` / `MQTT_PASS`: Credentials for the MQTT server.

Settings you probably don't need to change:

- `CRON`: Defaults to "0 0,6,12,18 * * *". This updates four times per day.
- `PERIOD`: Ignored if `CRON` is set. Number of seconds between tests. Must be greater than 300.
- `SPEEDTEST_SERVER_ID`: Defaults to automatic. Set to the integer server ID (eg. 12345) to skip server selection and force connecting so a specific ID.
- `SPEEDTEST_SERVER_EXCLUDE`: Defaults to none. Set to an integer server ID to ignore this server during selection. 
- `SPEEDTEST_SINGLE_MODE`: Use a single thread; may measure actual file transfer performance from a single host better. Equilvilent to `--single` on `speedtest-cli`

