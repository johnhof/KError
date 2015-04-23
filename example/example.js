var koa    = require('koa');
var route  = require('koa-route')
var KError = require('../KError');
var app    = koa();


/////////////////////////////////////////////////////////////////////////
//
// Handler Middleware
//
/////////////////////////////////////////////////////////////////////////


// Error Handler
app.use(KError.handler());


/////////////////////////////////////////////////////////////////////////
//
// Routes
//
/////////////////////////////////////////////////////////////////////////


app.use(route.get('/', function *() {
  this.body = {
    400 : '/400',
    401 : '/401',
    404 : '/404',
    500 : '/500',
    custom : {
      object : '/custom/params',
      params : '/custom/object',
    }
  };
}));

app.use(route.get('/custom/:type', function *(type) {
  if (type === 'params') {
    throw KError('My error is bad and I feel bad', 400, {
      type: 'params'
    });

  } else if (type === 'object') {
    throw KError({
      error   : 'My error is bad and I feel bad',
      status  : 400,
      details : {
        type : 'object'
      }
    });
  }
}));


app.use(route.get('/400', function *() {
  throw KError();
}));


app.use(route.get('/400', function *() {
  throw KError();
}));

app.use(route.get('/401', function *() {
  throw KError.notAuth();
}));

app.use(route.get('/404', function *() {
  throw KError.notFound();
}));

app.use(route.get('/500', function *() {
  iDontExist;
}));


/////////////////////////////////////////////////////////////////////////
//
// Finalize
//
/////////////////////////////////////////////////////////////////////////


const port = 3000;
app.listen(port);
console.log('\nlistening on port ' + port + '...\n');