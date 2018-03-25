# hafas-monitor-departures-ws-server

**A WebSocket server wrapping [`hafas-monitor-departures`](https://github.com/derhuerst/hafas-monitor-departures).**

[![npm version](https://img.shields.io/npm/v/hafas-monitor-departures-ws-server.svg)](https://www.npmjs.com/package/hafas-monitor-departures-ws-server)
[![build status](https://api.travis-ci.org/derhuerst/hafas-monitor-departures-ws-server.svg?branch=master)](https://travis-ci.org/derhuerst/hafas-monitor-departures-ws-server)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/hafas-monitor-departures-ws-server.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install hafas-monitor-departures-ws-server
```


## Usage

```js
const hafas = require('vbb-hafas')
const http = require('http')

const createMonitorServer = require('.')

const stations = [ // array of station ids
	'900000100003' // alexanderplatz
]
const interval = 5 * 1000 // every 5 seconds

const httpServer = http.createServer()
createMonitorServer(httpServer, hafas, stations, interval)
httpServer.listen(3000)
```

Let a client receive the data:

```js
const WebSocket = require('ws')

const client = new WebSocket('ws://localhost:3000/')
client.on('message', (msg) => {
	try {
		const departure = JSON.parse(msg)
		console.log(departure)
	} catch (err) {
		console.error(err)
	}
})
```


## Contributing

If you have a question or have difficulties using `hafas-monitor-departures-ws-server`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/hafas-monitor-departures-ws-server/issues).
