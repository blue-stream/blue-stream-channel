import { Router } from 'express';
import { UserPermissionsValidator } from './validator/userPermissions.validator';
import { UserPermissionsController } from './userPermissions.contoller';
import { Wrapper } from '../utils/wrapper';

const ChannelRouter: Router = Router();

ChannelRouter.post('/', UserPermissionsValidator.canCreate, Wrapper.wrapAsync(UserPermissionsController.create));
ChannelRouter.put('/', UserPermissionsValidator.canUpdateOne, Wrapper.wrapAsync(UserPermissionsController.updateOne));
ChannelRouter.delete('/', UserPermissionsValidator.canDeleteOne, Wrapper.wrapAsync(UserPermissionsController.deleteOne));
ChannelRouter.get('/one', UserPermissionsValidator.canGetOne, Wrapper.wrapAsync(UserPermissionsController.getOne));
ChannelRouter.get('/channels', UserPermissionsValidator.canGetUserPermittedChannels, Wrapper.wrapAsync(UserPermissionsController.getUserPermittedChannels));
ChannelRouter.get('/:channelId/users', UserPermissionsValidator.canGetChannelPermittedUsers, Wrapper.wrapAsync(UserPermissionsController.getChannelPermittedUsers));
ChannelRouter.get('/channels/amount', UserPermissionsValidator.canGetUserPermittedChannelsAmount, Wrapper.wrapAsync(UserPermissionsController.getUserPermittedChannelsAmount));
ChannelRouter.get('/:channelId/users/amount', UserPermissionsValidator.canGetChannelPermittedUsersAmount, Wrapper.wrapAsync(UserPermissionsController.getChannelPermittedUsersAmount));

export { ChannelRouter };
