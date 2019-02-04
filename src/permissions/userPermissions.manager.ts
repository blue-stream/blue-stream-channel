import { IUserPermissions, PermissionTypes } from './userPermissions.interface';

import { UserPermissionsRepository } from './userPermissions.repository';
import { UnauthorizedUserError, ChannelNotFoundError } from '../utils/errors/userErrors';
import { IChannel } from '../channel/channel.interface';
import { ChannelManager } from '../channel/channel.manager';

export class UserPermissionsManager {

    static async create(userPermissions: IUserPermissions, requestingUser: string) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, userPermissions.channel),
            ChannelManager.getById(userPermissions.channel),
        ]);

        const [isRequestingUserAdmin, channel] = returnedResults;

        if (channel) {
            if (isRequestingUserAdmin) {
                return UserPermissionsRepository.create(userPermissions);
            }

            throw new UnauthorizedUserError();
        }

        throw new ChannelNotFoundError();
    }

    static async updateOne(requestingUser: string, user: string, channel: string, permissions: PermissionTypes[]) {
        const isRequestingUserAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, channel);

        if (isRequestingUserAdmin) {
            return UserPermissionsRepository.updateOne(user, channel, permissions);
        }

        throw new UnauthorizedUserError();
    }

    static async deleteOne(requestingUser: string, user: string, channel: string) {
        const isRequestingUserAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, channel);

        if (isRequestingUserAdmin) {
            return UserPermissionsRepository.deleteOne(user, channel);
        }

        throw new UnauthorizedUserError();
    }

    // Should we add premissions check for GETTERS ?
    static async getOne(requestingUser: string, user: string, channel: string) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            UserPermissionsRepository.getOne(user, channel),
        ]);

        const [isRequestingUserAdmin, userPermissions] = returnedResults;

        if (isRequestingUserAdmin) {
            return userPermissions;
        }

        throw new UnauthorizedUserError();
    }

    // Should we add premissions check for GETTERS ?
    static async getMany(requestingUser: string, user: string, channel: string, permission: PermissionTypes, startIndex?: number, endIndex?: number, sortOrder?: '-' | '', sortBy?: string) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            UserPermissionsRepository.getMany(user, channel, permission, startIndex, endIndex, sortOrder, sortBy),
        ]);

        const [isRequestingUserAdmin, usersPermissions] = returnedResults;

        if (isRequestingUserAdmin) {
            return usersPermissions;
        }

        throw new UnauthorizedUserError();
    }

    static async getAmount(requestingUser: string, user: string, channel: string, permission: PermissionTypes) {
        const returnedResults = await Promise.all([
            UserPermissionsManager.isUserAdmin(requestingUser, channel),
            UserPermissionsRepository.getAmount(user, channel, permission),
        ]);

        const [isRequestingUserAdmin, amount] = returnedResults;

        if (isRequestingUserAdmin) {
            return amount;
        }

        throw new UnauthorizedUserError();
    }

    static async isUserAdmin(user: string, channel: string): Promise<boolean> {
        const requestingUserPremissions: IUserPermissions | null = await UserPermissionsRepository.getOne(user, channel);

        if (requestingUserPremissions && requestingUserPremissions.permissions.indexOf(PermissionTypes.Admin) === -1) {
            return true;
        }

        return false;
    }
}
