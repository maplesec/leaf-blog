# leaf-blog
A blog system based on node, express, mongoose, node_acl, vue

## Introduction

- Vue SSR, 利于SEO

- 使用node_acl做RBAC管理，方便扩展

- 使用element-ui, 并借鉴了开源项目[tale](https://github.com/otale/tale)的风格

- 访问 [Demo](http://maplesec.com)

## Install

Before installing, you should have a mongodb availiable.

Using cnpm:
```
cnpm install
```

## Start

1. Build for dist (client and server)

```
npm run build
```

2. Start server with pm2

```
npm start
```

3. Visit localhost:3000 for blog

4. Visit localhost:3000/login for admin

## Develop

1. Start server

```
npm start
```

2. Start webpack-dev-server

```
npm run dev
```

## Deploy

If dist has already been built and you want to deploy this project on another host, you can do like this:

```
cnpm install --production
```

then copy dist folder to 'leaf-blog/'

```
npm start
```

## License
[MIT](https://github.com/maplesec/leaf-blog/blob/master/LICENSE)