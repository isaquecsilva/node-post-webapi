const { timeout } = require('../utils.js')

class Queue {
	constructor(service) {
		this.service = service
		this.jobs = []
		this.keepRunning = true

		console.log('starting queue...')
		console.log('starting job processor...')

		this.processJob()
	}

	enqueue(obj) {
		console.log('new push to queue...')
		this.jobs.push(obj)
	}

	async processJob() {
		console.log('starting processing')

		while(this.keepRunning) {
			let job = this.jobs[0]
			
			if (job) {
				console.log('processing a job from queue...')

				this.jobs = this.jobs.slice(1)
				let result = this.service[job.serviceMethod](job.payload)

				if (result.error) {
					job.http.response.status(500).send(`could not create post: ${result.message}`)
				} else {
					job.http.response.status(201).send(`created: ${result.message}`)
				}


				console.log('job processing done')
			}

			await timeout(1)
		}
	}

	closeQueue() {
		console.log('finishing queue...')
		this.keepRunning = false
	}
}

module.exports = Queue