import { IChannel } from './channel.interface';

import { ChannelRepository } from './channel.repository';
import { ChannelBroker } from './channel.broker';
import { ChannelNotFoundError, UnauthorizedUserError, ProfileEditingIsForbiddenError } from '../utils/errors/userErrors';
import { IUserPermissions, PermissionTypes } from '../permissions/userPermissions.interface';
import { UserPermissionsManager } from '../permissions/userPermissions.manager';
export class ChannelManager {

    static async create(channel: IChannel) {
        const createdChannel: IChannel = await ChannelRepository.create(channel);

        if (createdChannel && createdChannel.id) {
            const userPermissions: IUserPermissions = {
                channel: createdChannel.id,
                permissions: [PermissionTypes.Admin, PermissionTypes.Edit, PermissionTypes.Remove, PermissionTypes.Upload],
                user: channel.user,
            };

            await UserPermissionsManager.create(userPermissions, channel.user);
        }

        return createdChannel;
    }

    static createMany(channels: IChannel[]) {
        return ChannelRepository.createMany(channels);
    }

    static async updateById(id: string, channel: Partial<IChannel>, requestingUser: string) {
        let isPermitted: boolean = false;
        const currentChannel: IChannel | null = await ChannelManager.getById(id);

        if (currentChannel) {
            if (currentChannel.isProfile) throw new ProfileEditingIsForbiddenError();

            if (requestingUser === currentChannel.user) {
                isPermitted = true;
            } else {
                const isAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, id);
                if (isAdmin) isPermitted = true;
            }

            if (isPermitted) {
                return ChannelRepository.updateById(id, channel);
            }

            throw new UnauthorizedUserError();
        }

        throw new ChannelNotFoundError();
    }

    static updateMany(channelFilter: Partial<IChannel>, channel: Partial<IChannel>) {
        return ChannelRepository.updateMany(channelFilter, channel);
    }

    static async deleteById(id: string, requestingUser: string) {
        let isPermitted: boolean = false;
        const currentChannel: IChannel | null = await ChannelManager.getById(id);

        if (currentChannel) {
            if (currentChannel.isProfile) throw new ProfileEditingIsForbiddenError();

            if (requestingUser === currentChannel.user) {
                isPermitted = true;
            } else {
                const isAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, id);
                if (isAdmin) isPermitted = true;
            }

            if (isPermitted) {
                const removed: IChannel | null = await ChannelRepository.deleteById(id);

                if (removed) {
                    ChannelBroker.publish('channelService.channel.remove.succeeded', { id });
                }

                return removed;
            }

            throw new UnauthorizedUserError();
        }

        throw new ChannelNotFoundError();
    }

    static getSearched(
        searchFilter: string,
        startIndex?: number,
        endIndex?: number,
        sortOrder?: '-' | '',
        sortBy?: string) {
        return ChannelRepository.getSearched(searchFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static getSearchedAmount(searchFilter: string) {
        return ChannelRepository.getSearchedAmount(searchFilter);
    }

    static getById(id: string) {
        return ChannelRepository.getById(id);
    }

    static getByIds(ids: string[]) {
        return ChannelRepository.getByIds(ids);
    }

    static getMany(channelFilter: Partial<IChannel>, startIndex?: number, endIndex?: number, sortOrder?: '-' | '', sortBy?: string) {
        return ChannelRepository.getMany(channelFilter, startIndex, endIndex, sortOrder, sortBy);
    }

    static getAmount(channelFilter: Partial<IChannel>) {
        return ChannelRepository.getAmount(channelFilter);
    }
}
