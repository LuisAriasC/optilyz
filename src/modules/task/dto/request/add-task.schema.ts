import Joi from '@hapi/joi';

export const AddTaskSchema = Joi.object().keys({
    description: Joi.string().required(),
    finishTime: Joi.number().required(),
    notificationTime: Joi.number().required(),
    user: Joi.string().required(),
});
