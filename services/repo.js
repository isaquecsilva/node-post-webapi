const { v4: uuid } = require('uuid')

class PostRepo {
	constructor(repositorySize = 100) {
		this.repo = []
	}

	getAllPosts() {
		return this.repo;
	}

	createPost({ nickname, contents }) {
		const duplicatedNick = this.findPostBy('nickname', nickname)

		if (duplicatedNick) {
			return {
				error: true,
				message: 'nickname already taken'
			}
		}

		const postId = uuid()

		this.repo.push({
			postId: postId,
			nickname: nickname,
			contents: contents,
		})

		return {
			error: false,
			message: postId
		}
	}

	findPostBy(selector = 'nickname', value) {
		const post = this.repo.find(p => p[selector] == value)
		if (post) {
			return true
		} else {
			return false
		}
	}
}

module.exports = PostRepo