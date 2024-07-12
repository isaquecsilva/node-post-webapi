module.exports = {
	timeout: seconds => new Promise(resolver => setTimeout(resolver, seconds*1000))
}