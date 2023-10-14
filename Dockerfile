FROM alpine

RUN apk add --update npm speedtest-cli

WORKDIR /opt/speedtest2ha

COPY . .

RUN npm ci --only=production

CMD [ "node", "src/speedtest.mjs" ]
