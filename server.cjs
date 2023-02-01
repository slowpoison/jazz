/*
 * server.cjs
 *
 * Jazz server
 * Copyright(c) 2021-2023, Vishal Verma <vish@slowpoison.net>
 */

const Logger = require('./logger.cjs').getLogger();
const fastify = require('fastify')()
const path = require('path')
const Jazz = require('./jazz.cjs')
const jazz = new Jazz();
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
const fs = require('fs')
const Eta = require('eta')
const JazzRef = require('./jazz-ref.cjs');

fastify.get('/README.md', (req, reply) => {
  reply
    .type('text/html')
    .send(md.render(fs.readFileSync('README.md').toString()))
  });

fastify.get('/public/bitcoin.svg', (req, reply) => {
  reply
    .type('image/svg+xml')
    .send(fs.readFileSync('public/bitcoin.svg'));
  });

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    });

fastify.get(JazzRef.Style.makeUrl(':pkgName', ':styleRef'), 
    async (req, reply) => {
      try {
        reply
          .type('text/css')
          // FIXME - read the provided style
          .send(fs.readFileSync('public/dash.css').toString())
      } catch (e) {
        Logger.error('Error loading style -', e);
        reply
          .type('text/plain')
          .send(e.stack);
      }
  });

fastify.get(JazzRef.JazzMod.makeUrl(':jazzModClass', ':jazzModRef'),
    async (req, reply) => {
    try {
      reply
        .type('image/svg+xml')
        .send(await jazz.genJazzModSvg(
          'default',
          JazzRef.JazzMod.makeId(req.params.jazzModClass, req.params.jazzModRef)));
    } catch (e) {
      Logger.error('Error loading JazzMod -', e);
      reply
        .type('text/plain')
        .send(e.stack)
    }
  });

fastify.get('/jazz/dash.html', async (req, reply) => {
    try {
    // XXX refactor - should really hide json generation and html conversion. don't belong here
      var dash = await jazz.genDashJson();
      var html = await genDashHtml(dash)
      reply
        .type('text/html')
        .send(html)
    } catch (e) {
      Logger.error('Error loading dash -', e);
      reply
        .type('text/plain')
        .send(e.stack)
    }
    });

async function genDashHtml(dash) {
  // TODO will need to be clever here depending on the client. Return
  // either the whole page as a single png, or let the client download
  // an html with a script that downloads individual elements
  var dashTemplate = fs.readFileSync('public/dash.html.eta').toString();
  return Eta.render(dashTemplate, {dash: dash, jazzRef: JazzRef, fs: fs, Eta: Eta});
}

fastify.listen(3000, '::', (err, address) => {
    if (err) throw err
    })
