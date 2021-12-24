
const fastify = require('fastify')()
const path = require('path')
const Jazz = require('./jazz.cjs')
const jazz = new Jazz();

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    })

fastify.get('/jazz/test.svg', async (req, reply) => {
    try {
      reply
        .type('image/svg+xml')
        .send(await jazz.genChart())
        //.send('<svg xmlns="http://www.w3.org/2000/svg" height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red"/></svg>')
    } catch (e) {
      console.log(e)
      reply
        .type('text/html')
        .send(e.toString())
    }
    });

fastify.listen(3000, (err, address) => {
    if (err) throw err
    })
