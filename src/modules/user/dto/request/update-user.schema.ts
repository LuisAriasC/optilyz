import Joi from '@hapi/joi';

export const UpdateUserSchema = Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
});
