import { Router, Request, Response, NextFunction } from 'express';

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void> | void;

  type Route = {
    path: string;
    method: string;
    handler: Handler | Handler[];
  };

  export const applyRoutes = (routes: Route[], router: Router) => {
    // let basePath = process.env.BASE_PATH;
    for (const route of routes) {
      let { method, path, handler } = route;
      path = `${path}`;
      console.log('path',path);
      (router as any)[method](path, handler);
    }
  };