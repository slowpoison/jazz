/*
 * server.cjs
 *
 * Jazz server
 * Copyright(c) 2021, Vishal Verma <vish@slowpoison.net>
 */
const fastify = require('fastify')()
const path = require('path')
const Jazz = require('./jazz.cjs')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
const fs = require('fs')
var Eta = require('eta')

fastify.get('/README.md', (req, reply) => {
  reply
    .type('text/html')
    .send(md.render(fs.readFileSync('README.md').toString()))
  })

fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    })

fastify.get('/jazz/s/:style', async (req, reply) => {
    reply
      .type('text/css')
      .send(fs.readFileSync('public/dash.css').toString())
  })

fastify.get('/jazz/e/:element', async (req, reply) => {
    var jazz = new Jazz()
    reply
      .type('image/svg+xml')
      .send(await jazz.genElementSvg(req.params.element))
  })

fastify.get('/jazz/dash.html', async (req, reply) => {
    var jazz = new Jazz()
    try {
      var dash = await jazz.genDash()
      var html = await genDashHtml(dash)
      reply
        .type('text/html')
        .send(html)
    } catch (e) {
      reply
        .type('text/plain')
        .send(e.stack)
    }
    })

async function genDashHtml(dash) {
  // TODO will need to be clever here depending on the client. Return
  // either the whole page as a single png, or let the client download
  // an html with a script that downloads individual elements
  var dashTemplate = fs.readFileSync('public/dash.html.eta').toString()
  return Eta.render(dashTemplate, dash)
}

fastify.listen(3000, '0.0.0.0', (err, address) => {
    if (err) throw err
    })
