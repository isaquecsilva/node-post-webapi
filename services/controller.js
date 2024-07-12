const { createWriteStream } = require('fs')

class PostController {
	constructor(repoService, queueService) {
		this.repoService = repoService
		this.queueService = queueService
		this.healthLogFile = undefined;
	}

	getAllPosts(request, response) {
		let posts = this.repoService.getAllPosts()
		return response.status(200).send(posts);
	}

	createPost({ serviceMethod, request, response }) {
		try {
			const { nickname, contents } = request.body;
			this.queueService.enqueue({
				serviceMethod,
				http: {
					response
				},
				payload: {
					nickname,
					contents
				}
			})
		}
		catch(error) {
			const {message} = error;
			console.log('log_error', message)
			return response.status(500).end('internal server error')
		}

	}

	healthLog(req, res) {
		if (!this.healthLogFile) {
			this.healthLogFile = createWriteStream('health.log', { encoding: 'utf8' })
		}

		this.healthLogFile.write(`health-check: ${new Date()}\n`)
		res.status(200).end('ok')
	}

	closeHealthLogFile() {
		if (this.healthLogFile) {
			this.healthLogFile.close()
		}
	}
}

module.exports = PostController