
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { userPermissionsModel } from './userPermissions.model';
import { config } from '../config';
import { isArray } from 'util';

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

    static getUserPermittedChannels(
        user: string,
        permissions: PermissionTypes[] | PermissionTypes,
        searchFilter: string,
        startIndex: number = 0,
        endIndex: number = config.channel.defaultAmountOfResults,
        sortOrder: '-' | '' = '',
        sortBy: string = 'user',
    )
        : Promise<IUserPermissions[] | null> {
        return userPermissionsModel
            .aggregate()
            .match({
                user,
                permissions: {
                    $in: isArray(permissions) ? permissions : [permissions],
                },
            })
            .lookup({
                from: 'channels',
                localField: 'channel',
                foreignField: '_id',
                as: 'lookupChannels',
            })
            .unwind('$lookupChannels')
            .project({
                _id: false,
                permissions: true,
                channel: {
                    $mergeObjects: [
                        '$$ROOT.lookupChannels',
                        {
                            id: '$lookupChannels._id',
                        },
                    ],
                },
            })
            .match({
                $or: [
                    { 'channel.user': { $regex: searchFilter, $options: 'i' } },
                    { 'channel.name': { $regex: searchFilter, $options: 'i' } },
                    { 'channel.description': { $regex: searchFilter, $options: 'i' } },
                ],
            })
            .sort(sortOrder + sortBy)
            .skip(+startIndex)
            .limit(endIndex - startIndex)
            .exec();
    }

    static getAmount(filter: Partial<IUserPermissions>) {
        return userPermissionsModel.countDocuments(filter).exec();
    }
}
