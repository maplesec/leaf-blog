import express from 'express';
import session from 'express-session';
import db from './mongodb/db.js';
import router from './routes/index';
import User from './controller/acl_user'

var qr = require('qr-image');

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

app.get('/qr', function(req, res){
    var code = qr.image('I am maplesec and I love js', { type: 'png' });
    res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    code.pipe(res);
})

app.get('*', async function(req, res){
    // 页面首次打开，或者刷新...
    // 不满足管理员身份的，直接重定向
    if(req.url.indexOf('/admin') === 0){
        const user_id = req.session.user_id;
        const auth = await User.getProfile(user_id)
        if(auth && auth.status === 1){
        
        }else{
            res.redirect('/login');
            return;
        }
    }
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
