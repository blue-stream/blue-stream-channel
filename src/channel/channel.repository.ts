
import { IChannel } from './channel.interface';
import { ChannelModel } from './channel.model';
import { ServerError } from '../utils/errors/applicationError';
import { config } from '../config';

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

    static getSearched(
        searchFilter: string = '',
        startIndex: number = 0,
        endIndex: number = config.channel.defaultAmountOfResults,
        sortOrder: '-' | '' = '',
        sortBy: string = 'name') {
        return ChannelModel.find({
            $or: [
                { user: { $regex: searchFilter, $options: 'i' } },
                { name: { $regex: searchFilter, $options: 'i' } },
                { description: { $regex: searchFilter, $options: 'i' } },
            ],
        })
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(endIndex - startIndex)
            .exec();
    }

    static getSearchedAmount(searchFilter: string = '') {
        return ChannelModel.countDocuments({
            $or: [
                { user: { $regex: searchFilter, $options: 'i' } },
                { name: { $regex: searchFilter, $options: 'i' } },
                { description: { $regex: searchFilter, $options: 'i' } },
            ],
        }).exec();
    }

    static getMany(
        channelFilter: Partial<IChannel>,
        startIndex: number = 0,
        endIndex: number = config.channel.defaultAmountOfResults,
        sortOrder: '-' | '' = '',
        sortBy: string = 'name')
        : Promise<IChannel[]> {
        return ChannelModel
            .find(channelFilter)
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(+endIndex - +startIndex)
            .exec();
    }

    static getByIds(ids: string[]) {
        return ChannelModel.find({
            _id: { $in: ids },
        }).exec();
    }

    static getAmount(channelFilter: Partial<IChannel>)
        : Promise<number> {
        return ChannelModel
            .countDocuments(channelFilter)
            .exec();
    }
}
