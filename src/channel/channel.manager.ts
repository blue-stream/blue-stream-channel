import { IChannel } from './channel.interface';

import { ChannelRepository } from './channel.repository';
export class ChannelManager {

    static create(channel: IChannel) {
        return ChannelRepository.create(channel);
    }

    static createMany(channels: IChannel[]) {
        return ChannelRepository.createMany(channels);
    }

    static updateNameById(id: string, name: string) {
        return ChannelRepository.updateById(id, { name });
    }

    static updateDescriptionById(id: string, description: string) {
        return ChannelRepository.updateById(id, { description });
    }

    static updateMany(channelFilter: Partial<IChannel>, channel: Partial<IChannel>) {
        return ChannelRepository.updateMany(channelFilter, channel);
    }

    static deleteById(id: string) {
        return ChannelRepository.deleteById(id);
    }

    static getById(id: string) {
        return ChannelRepository.getById(id);
    }

    static getMany(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getMany(channelFilter);
    }

    static getAmount(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getAmount(channelFilter);
    }
}
