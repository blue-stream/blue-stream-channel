
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { userPermissionsModel } from './userPermissions.model';
import { ServerError } from '../utils/errors/applicationError';
import { config } from '../config';

export class UserPermissionsRepository {
    static create(userPermissions: IUserPermissions)
        : Promise<IUserPermissions> {
        return userPermissionsModel.create(userPermissions);
    }

    static updateOne(user: string, channel: string, permissions: PermissionTypes[])
        : Promise<IUserPermissions | null> {
        return userPermissionsModel.findOneAndUpdate(
            { user, channel },
            { $set: { permissions } },
            { new: true, runValidators: true },
        ).exec();
    }

    static deleteOne(user: string, channel: string)
        : Promise<IUserPermissions | null> {
        return userPermissionsModel.findOneAndRemove(
            { user, channel },
        ).exec();
    }

    static getOne(user: string, channel: string)
        : Promise<IUserPermissions | null> {
        return userPermissionsModel.findOne(
            { user, channel },
        ).exec();
    }

    static getMany(
        filter: Partial<IUserPermissions>,
        startIndex: number = 0,
        endIndex: number = config.channel.defaultAmountOfResults,
        sortOrder: '-' | '' = '',
        sortBy: string = 'user',
    )
        : Promise<IUserPermissions[] | null> {
        return userPermissionsModel
            .find(filter)
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(endIndex - startIndex)
            .exec();
    }

    static getAmount(filter: Partial<IUserPermissions>) {
        return userPermissionsModel.countDocuments(filter).exec();
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
    }

    static createMany(channels: IChannel[])
        : Promise<IChannel[]> {
        return ChannelModel.insertMany(channels);
    }

    */
}
