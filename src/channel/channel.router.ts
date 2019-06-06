import { Router } from 'express';
import { ChannelValidator } from './validator/channel.validator';
import { ChannelController } from './channel.contoller';
import { wrapAsync } from '../utils/asyncWrapper';

const ChannelRouter: Router = Router();

ChannelRouter.post('/', ChannelValidator.canCreate, wrapAsync(ChannelController.create));
ChannelRouter.put('/:id', ChannelValidator.canUpdateById, wrapAsync(ChannelController.updateById));
ChannelRouter.delete('/:id', ChannelValidator.canDeleteById, wrapAsync(ChannelController.deleteById));
ChannelRouter.get('/search/amount', ChannelValidator.canGetSearchedAmount, wrapAsync(ChannelController.getSearchedAmount));
ChannelRouter.get('/search', ChannelValidator.canGetSearched, wrapAsync(ChannelController.getSearched));
ChannelRouter.get('/many', ChannelValidator.canGetMany, wrapAsync(ChannelController.getMany));
ChannelRouter.get('/amount', ChannelValidator.canGetAmount, wrapAsync(ChannelController.getAmount));
ChannelRouter.get('/:id', ChannelValidator.canGetById, wrapAsync(ChannelController.getById));

export { ChannelRouter };
