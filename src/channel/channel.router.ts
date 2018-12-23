import { Router } from 'express';
import { ChannelValidator } from './validator/channel.validator';
import { ChannelController } from './channel.contoller';
import { Wrapper } from '../utils/wrapper';

const ChannelRouter: Router = Router();

ChannelRouter.post('/', ChannelValidator.canCreate, Wrapper.wrapAsync(ChannelController.create));
ChannelRouter.put('/:id/name', ChannelValidator.canUpdateNameById, Wrapper.wrapAsync(ChannelController.updateNameById));
ChannelRouter.put('/:id/description', ChannelValidator.canUpdateDescriptionById, Wrapper.wrapAsync(ChannelController.updateDescriptionById));
ChannelRouter.delete('/:id', ChannelValidator.canDeleteById, Wrapper.wrapAsync(ChannelController.deleteById));
ChannelRouter.get('/many', ChannelValidator.canGetMany, Wrapper.wrapAsync(ChannelController.getMany));
ChannelRouter.get('/amount', ChannelValidator.canGetAmount, Wrapper.wrapAsync(ChannelController.getAmount));
ChannelRouter.get('/:id', ChannelValidator.canGetById, Wrapper.wrapAsync(ChannelController.getById));

export { ChannelRouter };
