import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { UserPermissionsRepository } from './userPermissions.repository';
import { UnauthorizedUserError, ChannelNotFoundError, UserPermissionsAlreadyExistsError, OwnerPermissionsCanNotBeRemovedError, ProfileEditingIsForbiddenError } from '../utils/errors/userErrors';
import { ChannelManager } from '../channel/channel.manager';

export class UserPermissionsManager {

    static async create(userPermissions: IUserPermissions, requestingUser: string, isSysAdmin: boolean) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, userPermissions.channel),
            ChannelManager.getById(userPermissions.channel),
            UserPermissionsManager.getOne(userPermissions.user, userPermissions.channel),
        ]);

        const [isRequestingUserAdmin, channel, user] = returnedResults;

        if (!channel) throw new ChannelNotFoundError();
        if (user) throw new UserPermissionsAlreadyExistsError();
        if (!isSysAdmin && !isRequestingUserAdmin && channel.user !== requestingUser) throw new UnauthorizedUserError();
        if (channel.isProfile &&
            (userPermissions.user !== requestingUser ||
             requestingUser !== channel.user)) throw new ProfileEditingIsForbiddenError();

        return UserPermissionsRepository.create(userPermissions);
    }

    static async updateOne(requestingUser: string, user: string, channel: string, permissions: PermissionTypes[], isSysAdmin: boolean) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            ChannelManager.getById(channel),
        ]);

        const [isRequestingUserAdmin, retChannel] = returnedResults;

        if (retChannel && retChannel.isProfile) throw new ProfileEditingIsForbiddenError();

        if (isRequestingUserAdmin || isSysAdmin) {
            return UserPermissionsRepository.updateOne(user, channel, permissions);
        }

        throw new UnauthorizedUserError();
    }

    static async deleteOne(requestingUser: string, user: string, channelId: string, isSysAdmin: boolean) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channelId),
            ChannelManager.getById(channelId),
        ]);

        const [isRequestingUserAdmin, channel] = returnedResults;

        if (channel && channel.isProfile) throw new ProfileEditingIsForbiddenError();
        if (!isRequestingUserAdmin && !isSysAdmin) throw new UnauthorizedUserError();
        if (!channel || channel.user === user) throw new OwnerPermissionsCanNotBeRemovedError();

        return UserPermissionsRepository.deleteOne(user, channelId);
    }

    // Only to get user's own permissions
    static getOne(requestingUser: string, channel: string) {
        return UserPermissionsRepository.getOne(requestingUser, channel);
    }

    static getUserPermittedChannels(requestingUser: string, permissions: PermissionTypes[] | PermissionTypes, searchFilter: string, startIndex?: number, endIndex?: number, sortOrder?: '-' | '', sortBy?: string) {
        return UserPermissionsRepository.getUserPermittedChannels(requestingUser, permissions, searchFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static getUserPermittedChannelsAmount(requestingUser: string) {
        return UserPermissionsRepository.getAmount({ user: requestingUser });
    }

    static async getChannelPermittedUsers(requestingUser: string, channel: string, startIndex?: number, endIndex?: number, sortOrder?: '-' | '', sortBy?: string) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            UserPermissionsRepository.getMany({ channel }, startIndex, endIndex, sortOrder, sortBy),
        ]);

        const [isRequestingUserAdmin, usersPermissions] = returnedResults;

        if (isRequestingUserAdmin) {
            return usersPermissions;
        }

        throw new UnauthorizedUserError();
    }

    static async getChannelPermittedUsersAmount(requestingUser: string, channel: string) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            UserPermissionsRepository.getAmount({ channel }),
        ]);

        const [isRequestingUserAdmin, usersPermissionsAmount] = returnedResults;

        if (isRequestingUserAdmin) {
            return usersPermissionsAmount;
        }

        throw new UnauthorizedUserError();
    }

    static async isUserAdmin(user: string, channel: string): Promise<boolean> {
        const requestingUserPremissions: IUserPermissions | null = await UserPermissionsRepository.getOne(user, channel);

        if (requestingUserPremissions && requestingUserPremissions.permissions.indexOf(PermissionTypes.Admin) !== -1) {
            return true;
        }

        return false;
    }
}
