import { Router } from 'express';
import { ChannelRouter } from './channel/channel.router';
import { UserPermissionsRouter } from './permissions/userPermissions.router';
import { HealthRouter } from './utils/health/health.router';

const AppRouter: Router = Router();

AppRouter.use('/api/channel', ChannelRouter);
AppRouter.use('/api/userPermissions', UserPermissionsRouter);
AppRouter.use('/health', HealthRouter);

export { AppRouter };
