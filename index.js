'use strict'

const {Server} = require('ws')
const _createMonitor = require('hafas-monitor-departures')

const createMonitorServer = (server, hafas, stations, interval, createMonitor = _createMonitor) => {
	const wsServer = new Server({server})
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
