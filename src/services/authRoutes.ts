import { Request, Response, NextFunction } from 'express';
import { loginUser, signUpUser } from './authController';

export default [
    {
        path: '/api/org/signup',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result:any =  await signUpUser('asianLabs',req.body)
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
              const result =  await loginUser('asianLabs',req.body)
              console.log('result',result)
              res.status(200).send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
]

