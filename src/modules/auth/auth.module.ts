import { Application } from 'express'
import { ModuleConfig } from '../../lib/module/module.config'
import { authenticateJWT } from '../../middleware/auth-middleware';
import { AuthController } from './auth.controller';
import requestMiddleware from '../../middleware/request-middleware';
import { SignupSchema, LoginSchema } from './dto';

export class AuthModule extends ModuleConfig {
    
    private authController: AuthController;
    constructor() {
        super('AuthModule')
        this.authController = new AuthController();
    }

    configureRoutes(app: Application) {
        app.route(`/signup`).post([requestMiddleware(this.authController.signup, { validation: { body: SignupSchema } })]);
        app.route(`/login`).post([requestMiddleware(this.authController.login, { validation: { body: LoginSchema } })]);
        app.route(`/logout`).post([requestMiddleware(this.authController.logout)]);
        app.route(`/refresh-token`).post([requestMiddleware(this.authController.refreshToken)]);
        return app
    }
}
