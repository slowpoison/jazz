
const fastify = require('fastify')()
const path = require('path')
const Jazz = require('./jazz.cjs')
const jazz = new Jazz();

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    })

fastify.get('/jazz/dash.html', async (req, reply) => {
      reply
        .type('text/html')
        .send(await jazz.genDash())
    })

fastify.listen(3000, '0.0.0.0', (err, address) => {
    if (err) throw err
    })
