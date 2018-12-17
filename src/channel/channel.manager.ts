import { IChannel } from './channel.interface';

import { ChannelRepository } from './channel.repository';
export class ChannelManager {

    
    static create(channel: IChannel) {
        return ChannelRepository.create(channel);
    }

    static createMany(channels: IChannel[]) {
        return ChannelRepository.createMany(channels);
    }

    static updateById(id: string, channel: Partial<IChannel>) {
        return ChannelRepository.updateById(id, channel);
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

    static getOne(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getOne(channelFilter);
    }

    static getMany(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getMany(channelFilter);
    }

    static getAmount(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getAmount(channelFilter);
    }
    }
