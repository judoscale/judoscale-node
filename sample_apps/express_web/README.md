# Judoscale Demo (Express)

A tiny Node.js app for testing Judoscale.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/judoscale/judoscale-sample-express)

___

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
- Install dependencies:
  ```shell
  npm install
  ```
- Then run the app:
```shell
bin/dev
```

This will run not only the app but also Judoscale proxy so you can check the metrics being collected by it.

In case you are working on one of Judoscale's adapters within this project you can replace the **NPM** published one for a local version.

- Uninstall the original package
  ```shell
  npm uninstall judoscale-node
  ```

- Replace it with the local copy
```shell
npm install "../../web"
```
