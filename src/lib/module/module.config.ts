import { Application } from 'express'

export abstract class ModuleConfig {
  name: string;

  constructor(
    name: string,
  ) {
    this.name = name;
  }

  getName() {
    return this.name
  }

  abstract configureRoutes(app: Application): Application
}
