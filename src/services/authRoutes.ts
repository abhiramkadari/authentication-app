import { Request, Response, NextFunction } from 'express';

export default [
    {
        path: '/api/org/signup',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result =  'signnnnnnn up'
              res.status(200).send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
    {
        path: '/api/org/login',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result =  'LOGIN'
              res.status(200).send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
]