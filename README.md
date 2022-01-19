# Flekk

YAML API testing library.

### Install

```
npm i -g flekk
```

### Usage

All test and setup files live in the `$APP_ROOT/test` directory.

Test files must en with `.test.yml`, for example `project.test.yml`. Setup files, which can be included in test files, must end with `.setup.yml`, like in `login.setup.yml`.

Add a config file in `$APP_ROOT/test/flekk.yml`:
```yml
# The URL and port of the app you are testing
url: http://localhost
port: 5061

# Database setup for the db command, requires mongodb
db:
  name: flekk-test
```

This is how a test file can look like:

```yml
# Run setup files
setup:
  - create-user
  - login

# Create account
api:
  action: account/create
  values:
    email: vidar@coding.fun
    password: testtest

# Login to account
api$login:
  values:
    email: vidar@coding.fun
    password: testtest
test:
  $login:
    token:
      required: true

# Perform test
api$result:
  action: site/create
  values:
    name: hello
test:
  $result:
    id:
      required: true
      is: id

# Access database
db$site:
  action: site/get
  query:
    id: $result.id
test:
  $site:
    id:
      required: true
```

There are 4 basic commands:

* __setup__ - Runs setup files
* __api__   - query an action endpoint
* __db__    - access the database
* __test__  - test a value

Setup and test files are based on [weblang.](https://github.com/eldoy/weblang)

Run the tests with:
```
# Run all tests
flekk

# Run matching tests
flekk names

# With nodemon
nodemon --exec flekk
```

Add this to you `package.json` file to run with `npm`:
```json
"scripts": {
  "test": "nodemon -q --exec flekk"
}
```
Then run with `npm run test` in your application.

MIT Licensed. Enjoy!
