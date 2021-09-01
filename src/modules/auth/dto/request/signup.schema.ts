import Joi from '@hapi/joi';

export const SignupSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});
