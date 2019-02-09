import { Router } from 'express';
import { ChannelRouter } from './channel/channel.router';
import { UserPermissionsRouter } from './permissions/userPermissions.router';

const AppRouter: Router = Router();

AppRouter.use('/api/channel', ChannelRouter);
AppRouter.use('/api/userPermissions', UserPermissionsRouter);

export { AppRouter };
