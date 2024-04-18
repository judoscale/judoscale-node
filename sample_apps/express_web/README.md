# Judoscale Demo (Express)

A tiny Node.js app for testing Judoscale.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/judoscale/judoscale-sample-express)

---

### Local Run

- Assuming you'll want to run this sample App locally "as is" first make sure you have Heroku CLI installed.
  ```shell
  heroku -v
  ```
- Make sure you are at the sample app root: `sample_apps/express_web`
- It is good practice to have `NODE_ENV` declared, for this:
  ```shell
  touch .env && echo "NODE_ENV=development" >> .env
  ```
- Install dependencies. Note that we're using `yarn` instead of `npm` so we can use "resolutions". More on this below.
  ```shell
  yarn install
  ```
- Then run the app:

```shell
bin/dev
```

This will run not only the app but also Judoscale proxy so you can check the metrics being collected by it.

http://localhost:5004

Note that the sample app uses the NPM registry version of judoscale-express, but the local version of judoscale-node-core. If you want to use the local version of judoscale-express, change the `resolutions` in `package.json`.

There doesn't seem to be a way to use _both_ local versions of judoscale-express and judoscale-node-core at the same time. When you use the local version of judoscale-express, the transitive dependency judoscale-node-core dependency will always be the register version, even if you include the local override in `resolutions`.

You could temporarily fix this by updating the `package.json` in judoscale-express, but make sure you don't commit that change.
