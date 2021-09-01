import Joi from '@hapi/joi';

export const AddUserSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
});
