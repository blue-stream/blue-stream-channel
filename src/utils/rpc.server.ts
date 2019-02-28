import { ChannelManager } from '../channel/channel.manager';
import { IChannel } from '../channel/channel.interface';

const jayson = require('jayson/promise');

export const RPCServer = new jayson.Server({
    async getChannelsByIds(ids: string[]) {
        const channels = await ChannelManager.getByIds(ids);

        const channelsMap: { [id: string]: IChannel } = {};

        channels.forEach((channel: IChannel) => {
            channelsMap[channel.id!] = channel;
        });

        return channelsMap;
    },

    createUserChannel(user: { id: string, name: string }) {
        const userChannel: IChannel = {
            user: user.id.toLowerCase(),
            name: user.name,
            description: user.id,
            isProfile: true,
        };

        return ChannelManager.create(userChannel);
    },
});
