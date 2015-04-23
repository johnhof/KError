/////////////////////////////////////////////////////////////////////////
//
// Constants
//
/////////////////////////////////////////////////////////////////////////


const DEF_ERROR   = 'Generic Error';
const DEF_STATUS  = 400;
const DEF_DETAILS = null;

const CRIT_ERROR  = 'Internal Server Error';
const CRIT_STATUS = 500;


/////////////////////////////////////////////////////////////////////////
//
// Custom Koa Error
//
/////////////////////////////////////////////////////////////////////////


// Constructor
//
function KError (seed, status, details) {
  var result = {};
  seed = seed || {};

  // if the seed is not an object
  if (typeof seed === 'string') {
    seed = {
      error   : seed,
      status  : status,
      details : details
    };
  }

  // allow use of new
  if (this) {
    this.error   = seed.error   || DEF_ERROR;
    this.status  = seed.status  || DEF_STATUS;
    this.details = seed.details || DEF_DETAILS;
    result = this;

  // otherwise return a simple object
  } else {
    result = {
      error   : seed.error   || DEF_ERROR,
      status  : seed.status  || DEF_STATUS,
      details : seed.details || DEF_DETAILS
    };
  }

  if (!(process.env.NODE_ENV === 'prod' && process.env.NODE_ENV === 'production') && result.status !== 404) {
    console.warn(KError.format(result, 1));
  }

  return result;
}

// Not Authorized - 401
//
KError.notAuth = function (errorName, details) {
  return new KError({
    error   : errorName || 'Not Authorized',
    status  : 401,
    details : details || DEF_DETAILS
  });
}

// Not Found - 404
//
KError.notFound = function (errorName, details) {
  return new KError({
    error   : errorName || 'Not Found',
    status  : 404,
    details : details || DEF_DETAILS
  });
}


/////////////////////////////////////////////////////////////////////////
//
// Utilities
//
/////////////////////////////////////////////////////////////////////////


// Send Error
//
KError.sendError = function *(ctx, err) {
  err = err || new KError();

  // if its a non KError, or a KError of status 500, emit and send it
  if (err instanceof Error || err.status == CRIT_STATUS) {
    err.error   = CRIT_ERROR;
    err.status  = CRIT_STATUS;
    err.details = DEF_DETAILS;
    console.error(err.stack);
  }

  // set up the response
  ctx.response.status = err.status || CRIT_STATUS;
  ctx.body = {
    error    : err.error   || CRIT_ERROR,
    status   : err.status  || DEF_STATUS,
    details  : err.details || DEF_DETAILS
  };
}

// Handler Middleware
//
KError.handler = function () {
  // return a generator for now. this will allow config settings in later versions
  return function *(next) {
    try {
      yield next;
    } catch (err) {
      yield KError.sendError(this, err);
    }

    if (this.status === 404) {
      yield KError.sendError(this, KError.notFound());
    };
  }
}

// Format
//
KError.format = function (KErr, unwind) {
  var stack = (new Error()).stack;

  stack = stack.replace(/^[^\(]+?[\n$]/gm, '');
  stack = stack.replace(/^\s+at\s+/gm, '');
  stack = stack.split('\n');

  stack.shift();

  // remove {unwind} number of lines from the stack
  if (unwind) {
    for (var i = 0; i < unwind; i++) {
      stack.shift();
    }
  }

  stack.unshift('KError: ' + KErr.error);

  return stack.join('\n    ');
}


/////////////////////////////////////////////////////////////////////////
//
// Export
//
/////////////////////////////////////////////////////////////////////////


module.exports = KError;