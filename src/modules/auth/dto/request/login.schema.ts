import Joi from '@hapi/joi';

export const LoginSchema = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
