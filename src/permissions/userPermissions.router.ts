import { Router } from 'express';
import { UserPermissionsValidator } from './validator/userPermissions.validator';
import { UserPermissionsController } from './userPermissions.contoller';
import { wrapAsync } from '@bit/blue-stream.utils.async-wrapper';

const UserPermissionsRouter: Router = Router();

UserPermissionsRouter.post('/', UserPermissionsValidator.canCreate, wrapAsync(UserPermissionsController.create));
UserPermissionsRouter.put('/', UserPermissionsValidator.canUpdateOne, wrapAsync(UserPermissionsController.updateOne));
UserPermissionsRouter.delete('/', UserPermissionsValidator.canDeleteOne, wrapAsync(UserPermissionsController.deleteOne));
UserPermissionsRouter.get('/one', UserPermissionsValidator.canGetOne, wrapAsync(UserPermissionsController.getOne));
UserPermissionsRouter.get('/channels', UserPermissionsValidator.canGetUserPermittedChannels, wrapAsync(UserPermissionsController.getUserPermittedChannels));
UserPermissionsRouter.get('/:channelId/users', UserPermissionsValidator.canGetChannelPermittedUsers, wrapAsync(UserPermissionsController.getChannelPermittedUsers));
UserPermissionsRouter.get('/:channelId/admin', UserPermissionsValidator.canGetIsUserAdmin, wrapAsync(UserPermissionsController.getIsUserAdmin));
UserPermissionsRouter.get('/:channelId/admins', UserPermissionsValidator.canGetChannelAdmins, wrapAsync(UserPermissionsController.getChannelAdmins));
UserPermissionsRouter.get('/channels/amount', UserPermissionsValidator.canGetUserPermittedChannelsAmount, wrapAsync(UserPermissionsController.getUserPermittedChannelsAmount));
UserPermissionsRouter.get('/:channelId/users/amount', UserPermissionsValidator.canGetChannelPermittedUsersAmount, wrapAsync(UserPermissionsController.getChannelPermittedUsersAmount));

export { UserPermissionsRouter };
