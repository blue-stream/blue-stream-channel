import { Router } from 'express';
import { UserPermissionsValidator } from './validator/userPermissions.validator';
import { UserPermissionsController } from './userPermissions.contoller';
import { Wrapper } from '../utils/wrapper';

const ChannelRouter: Router = Router();

ChannelRouter.post('/', UserPermissionsValidator.canCreate, Wrapper.wrapAsync(UserPermissionsController.create));
ChannelRouter.put('/', UserPermissionsValidator.canUpdateOne, Wrapper.wrapAsync(UserPermissionsController.updateOne));
ChannelRouter.delete('/', UserPermissionsValidator.canDeleteOne, Wrapper.wrapAsync(UserPermissionsController.deleteOne));
ChannelRouter.get('/one', UserPermissionsValidator.canGetOne, Wrapper.wrapAsync(UserPermissionsController.getOne));
ChannelRouter.get('/many', UserPermissionsValidator.canGetMany, Wrapper.wrapAsync(UserPermissionsController.getMany));
ChannelRouter.get('/amount', UserPermissionsValidator.canGetAmount, Wrapper.wrapAsync(UserPermissionsController.getAmount));

export { ChannelRouter };
