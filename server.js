import express from 'express';
import session from 'express-session';
import db from './mongodb/db.js';
import router from './routes/index';

const { createBundleRenderer } = require('vue-server-renderer')
const cookieParser = require('cookie-parser')
const app = express();

app.use(session({
    name: 'SID',
    secret: 'SID',
    resave: true,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure:false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

app.use(cookieParser());

app.use('/static', express.static('dist/static'));

//import vueApp from './src/entry-server';
//const serverRender = require('vue-server-renderer');

const bundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false, // 推荐
  template: require('fs').readFileSync('./index.template.html', 'utf-8'),
  clientManifest
})

router(app);

app.get('*', function(req, res){
    // const renderer = serverRender.createRenderer({
    //     template: require('fs').readFileSync('./src/index.template.html', 'utf-8')
    // })
    const context = {
        title: 'test',
        url: req.url,
        cookies: req.cookies,
    }
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err);
            req.headers['charset'] = 'utf-8';
            // TODO: 500页面
            res.status(500).end('Internal Server Error' + err)
            return
        }
        res.end(html)
    })
})

app.listen(3000);

console.log("listen 3000");
