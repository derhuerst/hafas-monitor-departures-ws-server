'use strict'

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
