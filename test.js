'use strict'

const {Readable} = require('stream')
const http = require('http')
const assert = require('assert')
const WebSocket = require('ws')

const createMonitorServer = require('.')

const stations = [ // array of station ids
	'900000100003' // alexanderplatz
]
const interval = 5 * 1000 // every 5 seconds

const createMockMonitor = (hafas, stations, interval) => {
	const monitor = new Readable({
		objectMode: true,
		read: () => {}
	})

	let _interval = setInterval(() => {
		monitor.push({foo: 'bar'})
	}, 1 * 1000)

	monitor.stop = () => {
		if (_interval !== null) {
			clearInterval(_interval)
			_interval = null
		}
	}

	return monitor
}

const mockHafas = {
	departures: (id, opt) => Promise.resolve([{foo: 'bar'}])
}

const httpServer = http.createServer()
createMonitorServer(httpServer, mockHafas, stations, interval, createMockMonitor)
httpServer.listen(3000)

setTimeout(() => {
	const client = new WebSocket('ws://localhost:3000/')

	let received = false
	client.once('message', (msg) => {
		received = true
		try {
			const dep = JSON.parse(msg)
			assert.deepStrictEqual(dep, {foo: 'bar'})
		} catch (err) {
			assert.ifError(err)
		}
		client.close()
		httpServer.close()
	})

	setTimeout(() => {
		assert.ok(received)
	}, interval + 1000)
}, 100)
