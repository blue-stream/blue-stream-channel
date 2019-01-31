
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { userPermissionsModel } from './userPermissions.model';
import { ServerError } from '../utils/errors/applicationError';
import { config } from '../config';

export class UserPermissionsRepository {
    static create(userPermissions: IUserPermissions)
        : Promise<IUserPermissions> {
        return userPermissionsModel.create(userPermissions);
    }

    /*static createMany(channels: IChannel[])
        : Promise<IChannel[]> {
        return ChannelModel.insertMany(channels);
    }*/

    static updateByUser(userPermissions: IUserPermissions)
        : Promise<IUserPermissions | null> {
        return userPermissionsModel.findOneAndUpdate(
            { user: userPermissions },
            { $set: { permissions: userPermissions.permissions } },
            { new: true, runValidators: true },
        ).exec();
    }
    /*
    static updateMany(channelFilter: Partial<IChannel>, channel: Partial<IChannel>)
        : Promise<any> {

        if (Object.keys(channel).length === 0) {
            throw new ServerError('Update data is required.');
        }

        return ChannelModel.updateMany(
            channelFilter,
            { $set: channel },
        ).exec();
    } */

    static deleteByUser(user: string)
        : Promise<IUserPermissions | null> {
        return userPermissionsModel.findOneAndRemove(
            { user },
        ).exec();
    }

    static getByUser(user: string)
        : Promise<IUserPermissions[] | null> {
        return userPermissionsModel.find(
            { user },
        ).exec();
    }
    /*
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
    */
}
