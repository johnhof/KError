# KError



## Key

- [Usage](#usage)
- [Example](#example)
- [Handler Middleware](#handler-middleware)
- [Generators](#generators)
  - [`KError([seed], [status], [details])`](#kerrorseed-status-details)
  - [`KError.notFound([errorOverride] [details])`](#kerrornotfounderroroverride-details)
  - [`KError.notAuth([errorOverride] [details])`](#kerrornotautherroroverride-details)



## Usage

```javascript
var koa    = require('koa');
var route  = require('koa-route')
var KError = require('KError');
var app    = koa();

app.use(KError.handler());

app.use(route.get('/ok', function *() {
  this.body = { success : true };
}));


app.use(route.get('/400', function *() {
  throw KError();
}));


app.use(route.get('/401', function *() {
  throw KError.notAuth();
}));

app.listen(3000);
```

## Example

Take a look at the [Example Server]()

To Run:
- `$ npm install`
- `$ npm start`
- visit `http://localhost:3000`

## Handler Middleware

Catches and normalizes errors that bubble up from the yielded middleware. all errors follow the same format.

```javascript
{
  error   : String,
  status  : Number,
  details : Mixed
}
```

Unrecognized errors are printed to the console and a 500 is sent of the following format.

```javascript
{
  error   : 'Internal Server Error',
  status  : 500,
  details : null
}
```

To catch errors, simply add to koa's middleware.


```javascript
var koa    = require('koa');
var KError = require('KError');
var app    = koa();

app.use(KError.handler());

// all routes return
// {
//   error   : 'Not Found',
//   status  : 404,
//   details : null
// }
```

## Generators

### `KError([seed], [status], [details])`

An error can be generated using multiple error parameters.

```javascript
throw KError('My error is bad and I feel bad', 400, ['one bad thing', 'another bad thing']);
```

An error can also be generated using a single object parameter.

```javascript
throw KError({
  error   : 'My error is bad and I feel bad',
  status  : 400,
  details : ['one bad thing', 'another bad thing']
});
```

Any of the parameters can be omitted in either case, and will default to the following unless overridden.

```javascript
{
  error   : 'Generic Error',
  status  : 400,
  details : null
}
```


### `KError.notFound([errorOverride] [details])`

Alias for

```javascript
throw KError({
  error   : errorOverride || 'Not Found',
  status  : 404,
  details : details || null
});
```


### `KError.notAuth([errorOverride] [details])`

Alias for

```javascript
throw KError({
  error   : errorOverride || 'Not Authorized',
  status  : 401,
  details : details || null
});
```