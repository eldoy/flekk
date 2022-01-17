# Flekk

YAML API testing library.

### Install

```
npm i flekk
```

### Usage

```yml
# Create account
api:
  action: account/create
  values:
    email: vidar@eldoy.com
    password: testtest

# Login to account
login$api:
  values:
    email: vidar@eldoy.com
    password: testtest
test:
  $login:
    token:
      required: true

# Perform test
result$api:
  action: site/create
  values:
    name: hello
test:
  $result:
    id:
      required: true
      is: id

# Access database
site$db:
  action: site/get
  query:
    id: $result.id
test:
  $site:
    id:
      required: true
```

MIT Licensed. Enjoy!
