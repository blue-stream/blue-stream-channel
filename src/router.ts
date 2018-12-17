import { Router } from 'express';
import { ChannelRouter } from './channel/channel.router';

const AppRouter: Router = Router();

AppRouter.use('/api/channel', ChannelRouter);

export { AppRouter };
