'use strict'

const {Server} = require('ws')
const createMonitor = require('hafas-monitor-departures')

const createMonitorServer = (httpServer, hafas, stations, interval) => {
	const wsServer = new Server({server: httpServer})
	// todo: wsServer.on('error')

	let monitor = null
	const restart = () => {
		if (monitor) return null
		monitor = createMonitor(hafas, stations, interval)
	}
	const stop = () => {
		if (!monitor) return
		monitor.stop()
		monitor = null
	}

	let clients = 0
	wsServer.on('connection', (client) => {
		if (clients === 0) restart()
		clients++

		const onData = dep => client.send(JSON.stringify(dep))
		monitor.on('data', onData)
		const onClose = () => client.close()
		monitor.on('close', onClose)

		client.once('close', () => {
			clients--

			monitor.removeListener('data', onData)
			monitor.removeListener('close', onClose)
			if (clients === 0) stop()
		})
	})

	return wsServer
}

module.exports = createMonitorServer
