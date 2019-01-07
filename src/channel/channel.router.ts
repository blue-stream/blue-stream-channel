import { Router } from 'express';
import { ChannelValidator } from './validator/channel.validator';
import { ChannelController } from './channel.contoller';
import { Wrapper } from '../utils/wrapper';

const ChannelRouter: Router = Router();

ChannelRouter.post('/', ChannelValidator.canCreate, Wrapper.wrapAsync(ChannelController.create));
ChannelRouter.put('/:id', ChannelValidator.canUpdateById, Wrapper.wrapAsync(ChannelController.updateById));
ChannelRouter.delete('/:id', ChannelValidator.canDeleteById, Wrapper.wrapAsync(ChannelController.deleteById));
ChannelRouter.get('/many', ChannelValidator.canGetMany, Wrapper.wrapAsync(ChannelController.getMany));
ChannelRouter.get('/amount', ChannelValidator.canGetAmount, Wrapper.wrapAsync(ChannelController.getAmount));
ChannelRouter.get('/:id', ChannelValidator.canGetById, Wrapper.wrapAsync(ChannelController.getById));

export { ChannelRouter };
