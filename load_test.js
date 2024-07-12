/*load test*/

const http = require('http')
const crypto = require('crypto')
const cliparse = require('cliparse')
const parsers = cliparse.parsers;

function randomString(size = 4) {
	const bytes = crypto.randomBytes(size)
	return bytes.toString('hex')
}

const options = {
	hostname: '127.0.0.1',
	port: 8000,
	path: "/create",
	method: 'POST',
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	}
}

async function runLoadTest(params) {
	const { times } = params.options

	for (let r = 0; r <= times; r++) {
		const body = JSON.stringify({
			nickname: randomString(),
			contents: randomString(8)
		})

		options.headers['Content-Length'] = body.length

		const request = http.request(options, response => {
			console.log(`\nrequest_id<${r}>: ${response.statusCode}`)
			response.pipe(process.stdout)
		})

		request.end(body)
	}
}

var cliParser = cliparse.cli({
	name: "load_test",
	description: "script to run webapi load tests",
	commands: [
		cliparse.command(
			"run",
			{
				description: "Runs the load test.",
				options: [
					cliparse.flag(
						"times",
						{
							default: 100,
							aliases: ["t"],
							parser: parsers.intParser,
							description: "The number of requests reaching the api endpoint."
						}
					)
				]
			},
			runLoadTest
		)
	]

})

cliparse.parse(cliParser)