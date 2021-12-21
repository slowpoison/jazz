/*const D3Node = require('d3-node');

const d3n = new D3Node();

d3n.createSVG(10, 20).append('g');
console.log(d3n.svgString());
*/

const fastify = require('fastify')()
const path = require('path')

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    })

fastify.listen(3000, (err, address) => {
    if (err) throw err
    })
