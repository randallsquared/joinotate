const Joi = require('joi');
const Boom = require('boom');

const validate = (handler, options = { abortEarly: true, allowUnknown: true }) => {
  if (!handler.joi) return handler;

  const schema = Joi.object(handler.joi);
  const wrapper = async(req, res) => {
    const { error, value } = Joi.validate(req, schema, options);
    if (error) {
      let error_message;
      try {
        error_message = error.details[0].message;
      } catch (e) {
        error_message = null;
      }
      if (error_message) {
        throw Boom.badRequest(error_message);
      } else {
        throw Boom.serverUnavailable('Unknown error during validation');
      }
    } else {
      req = value;
    }
    return handler(req, res);
  };
  return wrapper;
};

const decorate = (routers = {}) => {
  for (const [key, router] of Object.entries(routers)) {
    routers[key] = (path, handler) => router(path, validate(handler));
  }
  return routers;
};

decorate.validate = validate;
decorate.decorate = decorate;
// provide the copies of Joi and Boom we use
decorate.Joi = Joi;
decorate.Boom = Boom;


module.exports = decorate;
