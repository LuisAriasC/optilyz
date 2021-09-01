import { Application } from 'express'
import { ModuleConfig } from '../../lib/module/module.config'
import { authenticateJWT } from '../../middleware/auth-middleware';
import { TaskController } from './task.controller';
import requestMiddleware from '../../middleware/request-middleware';
import { AddTaskSchema, SearchTasksSchema, UpdateTaskSchema } from './dto';

export class TaskModule extends ModuleConfig {
    
    private taskController: TaskController;
    constructor() {
        super('TaskModule')
        this.taskController = new TaskController();
    }

    configureRoutes(app: Application) {
        app.route(`/task`).post([authenticateJWT, requestMiddleware(this.taskController.add, { validation: { body: AddTaskSchema } })]);
        app.route(`/task/:taskId`).get([authenticateJWT, requestMiddleware(this.taskController.get)]);
        app.route(`/task/:taskId`).put([authenticateJWT, requestMiddleware(this.taskController.update, { validation: { body: UpdateTaskSchema } })]);
        app.route(`/task/:taskId`).delete([authenticateJWT, requestMiddleware(this.taskController.remove)]);
        app.route(`/tasks`).get([authenticateJWT, requestMiddleware(this.taskController.all)]);
        app.route(`/task/search`).post([authenticateJWT, requestMiddleware(this.taskController.search, { validation: { body: SearchTasksSchema } })]);
        app.route(`/task/user/:taskId`).get([authenticateJWT, requestMiddleware(this.taskController.userByTask)]);
        return app
    }
}
