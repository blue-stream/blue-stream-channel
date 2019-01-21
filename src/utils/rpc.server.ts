import { ChannelManager } from '../channel/channel.manager';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    getChannelsByIds(ids: string[]) {
        return ChannelManager.getByIds(ids);
    },
});
