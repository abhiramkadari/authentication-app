import { Request, Response, NextFunction } from 'express';
import { testJira } from './jiraController';
import { setupJira } from './jiraModel';

export default [
    {
        path: '/testJira',
        method: 'post',
        handler: [
          async (req: Request, res: Response, next:NextFunction) => {
            try{
              const result:any =  await testJira()
              res.send(result);
            }catch(e){
              next(e); 
            }
          
          },
        ],
    },
    {
      path: '/setup',
      method: 'post',
      handler: [
        async (req: Request, res: Response, next:NextFunction) => {
          try{
            const result:any =  await setupJira()
            res.status(200).send(result);
          }catch(e){
            next(e); 
          }
        
        },
      ],
  },
]