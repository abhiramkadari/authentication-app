import { Request, Response, NextFunction } from 'express';
import { testJira } from './jiraController';

export default [
    {
        path: '/testJira',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result:any =  await testJira()
              res.status(200).send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
]