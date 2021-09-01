import Joi from '@hapi/joi';

export const SearchUsersSchema = Joi.object().keys({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
});
