
import { IChannel } from './channel.interface';
import { ChannelModel } from './channel.model';
import { ServerError } from '../utils/errors/applicationError';

export class ChannelRepository {
    static create(channel: IChannel)
        : Promise<IChannel> {
        return ChannelModel.create(channel);
    }

    static createMany(channels: IChannel[])
        : Promise<IChannel[]> {
        return ChannelModel.insertMany(channels);
    }

    static updateById(id: string, channel: Partial<IChannel>)
        : Promise<IChannel | null> {
        return ChannelModel.findByIdAndUpdate(
            id,
            { $set: channel },
            { new: true, runValidators: true },
        ).exec();
    }

    static updateMany(channelFilter: Partial<IChannel>, channel: Partial<IChannel>)
        : Promise<any> {

        if (Object.keys(channel).length === 0) {
            throw new ServerError('Update data is required.');
        }

        return ChannelModel.updateMany(
            channelFilter,
            { $set: channel },
        ).exec();
    }

    static deleteById(id: string)
        : Promise<IChannel | null> {
        return ChannelModel.findByIdAndRemove(
            id,
        ).exec();
    }

    static getById(id: string)
        : Promise<IChannel | null> {
        return ChannelModel.findById(
            id,
        ).exec();
    }

    static getMany(channelFilter: Partial<IChannel>, startIndex: number = 0, endIndex: number = 20, sortOrder: '-' | '' = '', sortBy: string = 'name')
        : Promise<IChannel[]> {
        return ChannelModel
            .find(channelFilter)
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(+endIndex - +startIndex)
            .exec();
    }

    static getAmount(channelFilter: Partial<IChannel>)
        : Promise<number> {
        return ChannelModel
            .countDocuments(channelFilter)
            .exec();
    }
}
