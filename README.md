# joinotate

A tiny Joi validator for Zeit's micro

```
const qs = require('querystring');
const parse = require('url').parse;
const { validate, Joi } = require('joinotate');

const handler = async (req) => {
  const query = qs.parse(parse(req.url).query);
  return `Hi, ${query.name}`;
};

handler.joi = {
  query: {
    name: Joi.required(),
  },
};

module.exports = validate(handler);

```

joinotate also has a decorator for [swarfless](https://www.npmjs.com/package/swarfless):


```
const micro = require('micro');
const qs = require('querystring');
const parse = require('url').parse;
const router = require('swarfless');
const { decorate, Joi } = require('joinotate');
const { get, post, route } = decorate({ get: router.get, post: router.post })


// okay to omit `.joi` annotation if no validate to be performed
get('/', async () => 'Root of server');

// swarfless adds req.params
const hiworld = (req) => `Hi, ${req.params.name}`;

hiworld.joi = {
  params: {
    name: Joi.required(),
  },
};

get('/hello/:name', hiname);

// `decorate` has already wrapped each handler in `validate`,
// so no need to explicitly do so here
module.exports = route;

```
