// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { CloudLogger } from '../../logging/logging.service';

// @Injectable()
// export class RequestLoggingMiddleware implements NestMiddleware {
//   constructor(private readonly cloudLogger: CloudLogger) {}

//   use(req: Request, res: Response, next: NextFunction) {
//     const start = Date.now();

//     const baseUrl = `${req.baseUrl}`;

//     this.cloudLogger.debug(`Incoming request ${baseUrl}`);

//     res.on('finish', () => {
//       const duration = Date.now() - start;
//       const statusCode = res.statusCode;
//       this.cloudLogger.log(
//         `${req.method} ${baseUrl} - ${duration}ms, ${statusCode}, Not Cached`,
//       );
//     });

//     next();
//   }
// }
