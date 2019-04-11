import { Router } from 'express';
import { UserPermissionsValidator } from './validator/userPermissions.validator';
import { UserPermissionsController } from './userPermissions.contoller';
import { Wrapper } from '../utils/wrapper';

const UserPermissionsRouter: Router = Router();

UserPermissionsRouter.post('/', UserPermissionsValidator.canCreate, Wrapper.wrapAsync(UserPermissionsController.create));
UserPermissionsRouter.put('/', UserPermissionsValidator.canUpdateOne, Wrapper.wrapAsync(UserPermissionsController.updateOne));
UserPermissionsRouter.delete('/', UserPermissionsValidator.canDeleteOne, Wrapper.wrapAsync(UserPermissionsController.deleteOne));
UserPermissionsRouter.get('/one', UserPermissionsValidator.canGetOne, Wrapper.wrapAsync(UserPermissionsController.getOne));
UserPermissionsRouter.get('/channels', UserPermissionsValidator.canGetUserPermittedChannels, Wrapper.wrapAsync(UserPermissionsController.getUserPermittedChannels));
UserPermissionsRouter.get('/:channelId/users', UserPermissionsValidator.canGetChannelPermittedUsers, Wrapper.wrapAsync(UserPermissionsController.getChannelPermittedUsers));
UserPermissionsRouter.get('/:channelId/admin', UserPermissionsValidator.canGetIsUserAdmin, Wrapper.wrapAsync(UserPermissionsController.getIsUserAdmin));
UserPermissionsRouter.get('/:channelId/admins', UserPermissionsValidator.canGetChannelAdmins, Wrapper.wrapAsync(UserPermissionsController.getChannelAdmins));
UserPermissionsRouter.get('/channels/amount', UserPermissionsValidator.canGetUserPermittedChannelsAmount, Wrapper.wrapAsync(UserPermissionsController.getUserPermittedChannelsAmount));
UserPermissionsRouter.get('/:channelId/users/amount', UserPermissionsValidator.canGetChannelPermittedUsersAmount, Wrapper.wrapAsync(UserPermissionsController.getChannelPermittedUsersAmount));

export { UserPermissionsRouter };
