# frontend

Before running anything, you need to `npm i` once, and you might need to install [vue-cli](https://cli.vuejs.org/guide/installation.html) globally

## Environment

Make sure you have npm installed.

There's some relevant environment variables:
- `VUE_APP_MOCK_API`: determines whether to use a mock local api that never hits the network. Set to anything to activate
- `VUE_APP_API_URL`: determines the base api url. Defaults to `http://localhost:5000/api`
- `NODE_ENV`: normally should have one of `production`, `development`, and `testing`. Production gets rid of overhead development features, and is taken care of by the webpack setup, while Testing removes features like fake networking delays

## Development
I recommend opening different sessions (tmux/terminals) and running these commands

```
$ VUE_APP_MOCK_API=yes npm run serve
$ NODE_ENV=testing npm run test:unit:watch
```

The `npm run serve` command will start a dev server with hot-reloading on http://localhost:8080, and if you set `VUE_APP_MOCK_API` to anything non-empty, it will switch to a mock API that never hits the network

The `npm run test:unit:watch` command starts automated mocha/chai unit tests, so that if you write to a file (or its spec file), it will rerun tests for them and their dependencies. Consider using `NODE_ENV=testing`

You could run multiple `npm run serve` with different env variables at the same time, and they will spawn on different ports, so you can develop on both mocked apis, and various different real ones 

## Production
running `NODE_ENV=production npm run build` generates static files that can be served from `dist`

It's important to note that even if there's a `/about` route, it's not from an `/about` folder, so if someone lands on a page with that url, they'll get a 404, unless you use a catch-all. Nginx' `try-files` is pretty convenient for this (https://medium.com/@thucnc/deploy-a-vuejs-web-app-with-nginx-on-ubuntu-18-04-f93860219030)

