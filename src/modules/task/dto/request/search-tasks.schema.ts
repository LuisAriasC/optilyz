import Joi from '@hapi/joi';

export const SearchTasksSchema = Joi.object().keys({
    description: Joi.string().optional(),
});
