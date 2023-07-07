const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

// Rewrite routes
server.use(jsonServer.rewriter({
    '/api/*': '/$1',    // /api/posts → /posts
}))

server.use(router)
server.listen(3500, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server
