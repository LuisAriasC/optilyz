import { Application } from 'express'
import { ModuleConfig } from '../../lib/module/module.config'
import { authenticateJWT } from '../../middleware/auth-middleware';
import { UserController } from './user.controller';
import requestMiddleware from '../../middleware/request-middleware';
import { AddUserSchema, SearchUsersSchema, UpdateUserSchema } from './dto';

export class UserModule extends ModuleConfig {
    
    private userController: UserController;
    constructor() {
        super('UserModule')
        this.userController = new UserController();
    }

    configureRoutes(app: Application) {
        app.route(`/user`).post([authenticateJWT, requestMiddleware(this.userController.add, { validation: { body: AddUserSchema } })]);
        app.route(`/user/:userId`).get([authenticateJWT, requestMiddleware(this.userController.get)]);
        app.route(`/user/:userId`).put([authenticateJWT, requestMiddleware(this.userController.update, { validation: { body: UpdateUserSchema } })]);
        app.route(`/user/:userId`).delete([authenticateJWT, requestMiddleware(this.userController.remove)]);
        app.route(`/users`).get([authenticateJWT, requestMiddleware(this.userController.all)]);
        app.route(`/user/search`).post([authenticateJWT, requestMiddleware(this.userController.search, { validation: { body: SearchUsersSchema } })]);
        app.route(`/user/tasks/:userId`).get([authenticateJWT, requestMiddleware(this.userController.tasksByUser)]);
        return app
    }
}
