const express = require('express')
const app = express()

const repository = require('./services/repo.js')
const postRepo = new repository()

const queue = new (require('./services/queue.js'))(postRepo)

const controller = require('./services/controller.js')
const postController = new controller(postRepo, queue)

const PORT = parseInt(process.argv[2]) || 8000;

app.use(express.json())

app.get("/all", (req, res) => {
	postController.getAllPosts(req, res)
})

app.post("/create", (req, res) => {
	postController.createPost({ 
		serviceMethod: 'createPost',
		request: req,
		response: res,
	})
})

app.get("/health", (req, res) => {
	postController.healthLog(req, res)
})

app.listen(PORT, function() {
	console.log(`server running at port ${PORT}...`)
})

process.on('SIGINT', (signal) => {
	console.log('signal_received:', signal)
	postController.closeHealthLogFile()
	app.close()
	process.exit(0)
})