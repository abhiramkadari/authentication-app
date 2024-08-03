import { Request, Response, NextFunction } from 'express';
import { testEmailService } from './testController';

export default [
    {
        path: '/testMail',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result:any =  await testEmailService()
              res.status(200).send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
]

