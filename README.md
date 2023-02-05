# Flekk

Low code testing library. Test your APIs using only YAML.

### Install

```
npm i -g flekk
```

### Files

All test and setup files live in the `$APP_ROOT/test` directory, and written with [weblang.](https://github.com/eldoy/weblang)

Test files must end with `.test.yml`, for example `project.test.yml`. Setup files, which can be included in test files, must end with `.setup.yml`, like in `login.setup.yml`.

### Config

Config files must end in `.config.yml`, like in `app.config.yml`.

The default config file should be added in `$APP_ROOT/test/flekk.config.yml`:
```yml
# The URL and port of the app you are testing
url: http://localhost
port: 5061

# Database setup for the db command, requires mongodb
db:
  name: flekk-test
```

The default config file is always loaded, and then other config files are merged on top of that.

### Commands

There are 6 basic commands:

* __config__ - load config files
* __setup__  - run setup files
* __api__    - query an action endpoint
* __db__     - access the database
* __test__   - test a value
* __log__    - log a value to console

This is how to use them:

```yml
# Load config file
@config: app

# Load multiple config files, will be merged
@config:
  - app
  - remote

# Run setup file
@setup: login

# Run multiple setup files
@setup:
  - create-user
  - login

# Test the site/create API
@api$result:
  action: site/create
  values:
    name: hello
  auth: $auth
@test$result:
  id:
    is: id

# Test database values
@db$site:
  action: site/get
  query:
    id: $result.id
@test$site:
  id:
    required: true

# Print value to terminal
$hello: world
@log: $hello
```

### Setup

Run the tests with:
```
# Run all tests
flekk

# Run matching tests
flekk names

# With nodemon
nodemon -e js,mjs,json,yml,css,md --exec flekk
```

Add this to you `package.json` file to run with `npm`:
```json
"scripts": {
  "test": "nodemon -q -e js,mjs,json,yml,css,md --exec flekk"
}
```
Then run with `npm run test` in your application.

MIT Licensed. Enjoy!
