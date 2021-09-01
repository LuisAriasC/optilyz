import Joi from '@hapi/joi';

export const UpdateTaskSchema = Joi.object().keys({
    description: Joi.string().optional(),
    finishTime: Joi.number().optional(),
    notificationTime: Joi.number().optional(),
    isCompleted: Joi.boolean().optional(),
});
