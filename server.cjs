/*
 * server.cjs
 *
 * Jazz server
 * Copyright(c) 2021-2024, Vishal Verma <vish@slowpoison.net>
 */

const fastify = require('fastify')();
const fastifyStatic = require('@fastify/static');
const Logger = require('./logger.cjs').getLogger();
const path = require('path')
var Yaml = require('yaml');

const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
const fs = require('fs')
const Eta = require('eta').Eta;

const JazzRef = require('./jazz-ref.cjs');
const Jazz = require('./jazz.cjs');
const { default: Dash } = require('./dash.cjs');
const jazz = new Jazz();
const eta = new Eta({views: 'public'});

var Settings = getSettings();

fastify.get('/README.md', (req, reply) => {
  reply
    .type('text/html')
    .send(md.render(fs.readFileSync('README.md').toString()))
  });

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
    });

fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'dashboards', 'public'),
    prefix: '/jazz/s/',
    decorateReply: false
    });


// /jazz/s/:pkgName/:styleRef
/*fastify.get(JazzRef.Style.makeUrl(':pkgName', ':styleRef'), 
    async (req, reply) => {
      console.log('req.params.pkgName', req.params.pkgName, 'req.params.styleRef', req.params.styleRef);
      try {
        reply
          .type('text/css')
          .send(fs.readFileSync(
            path.join(
              __dirname,
               'dashboards',
                JazzRef.Style.makeUrl(req.params.pkgName, req.params.styleRef))))
      } catch (e) {
        Logger.error('Error loading style -', e);
        reply
          .type('text/plain')
          .send(e.stack);
      }
  });
  */

// /jazz/m/:jazzModPkg/:jazzModRef
fastify.get(JazzRef.JazzMod.makeUrlFromRef(':jazzModRef'),
    async (req, reply) => {
    try {
      reply
        .type('image/svg+xml')
        .send(await jazz.genJazzModSvg(req.url))
    } catch (e) {
      Logger.error('Error loading JazzMod -', e);
      reply
        .type('text/plain')
        .send(e.stack)
    }
  });

fastify.get('/jazz/home', async (req, reply) => {
    try {
    // XXX refactor - should really hide json generation and html conversion. don't belong here
      var defaultDash = Settings.defaultDash;
      var dash = await jazz.genDashJson(defaultDash);
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
  return await eta.renderAsync('dash.html.eta', {dash: dash, jazz: jazz, JazzRef: JazzRef, fs: fs, Eta: Eta});
}

fastify.listen(
  {port:3000, host: '::'},
  (err, address) => {
    if (err) throw err
    })


function getSettings() {
  var settings = Yaml.parse(fs.readFileSync('settings.yaml').toString());
  // use local settings if available
  if (fs.existsSync('settings.local.yaml')) {
    var localSettings = Yaml.parse(fs.readFileSync('settings.local.yaml').toString());
    Object.assign(settings, localSettings);
  }
  return settings;
}
