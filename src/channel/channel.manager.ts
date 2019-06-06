import { IChannel } from './channel.interface';

import { ChannelRepository } from './channel.repository';
import { ChannelBroker } from './channel.broker';
import { ChannelNotFoundError, UnauthorizedUserError, ProfileEditingIsForbiddenError, DuplicateNameError } from '../errors/userErrors';
import { IUserPermissions, PermissionTypes } from '../permissions/userPermissions.interface';
import { UserPermissionsManager } from '../permissions/userPermissions.manager';
export class ChannelManager {

    static async create(channel: IChannel) {
        if (!channel.isProfile) {
            const existingChannel: IChannel[] = await ChannelManager.getMany({ name: channel.name }, 0, 1);

            if (existingChannel.length === 1) throw new DuplicateNameError();
        }

        const createdChannel: IChannel = await ChannelRepository.create(channel);

        if (createdChannel && createdChannel.id) {
            const userPermissions: IUserPermissions = {
                channel: createdChannel.id,
                permissions: [PermissionTypes.Admin, PermissionTypes.Edit, PermissionTypes.Remove, PermissionTypes.Upload],
                user: channel.user,
            };

            await UserPermissionsManager.create(userPermissions, channel.user, false);
        }

        return createdChannel;
    }

    static createMany(channels: IChannel[]) {
        return ChannelRepository.createMany(channels);
    }

    static async updateById(id: string, channel: Partial<IChannel>, requestingUser: string, isSystemAdmin: boolean) {
        let isPermitted: boolean = false;
        const currentChannel: IChannel | null = await ChannelManager.getById(id);

        if (!currentChannel) throw new ChannelNotFoundError();
        if (currentChannel.isProfile) throw new ProfileEditingIsForbiddenError();

        if (requestingUser === currentChannel.user || isSystemAdmin) {
            isPermitted = true;
        } else {
            const isAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, id);
            if (isAdmin) isPermitted = true;
        }

        if (!isPermitted) throw new UnauthorizedUserError();

        if (channel.name) {
            const existingChannel: IChannel[] = await ChannelManager.getMany({ name: channel.name }, 0, 1);

            if (existingChannel.length === 1 && existingChannel[0].id !== currentChannel.id) throw new DuplicateNameError();
        }

        return ChannelRepository.updateById(id, channel);
    }

    static updateMany(channelFilter: Partial<IChannel>, channel: Partial<IChannel>) {
        return ChannelRepository.updateMany(channelFilter, channel);
    }

    static async deleteById(id: string, requestingUser: string, isSystemAdmin: boolean) {
        let isPermitted: boolean = false;
        const currentChannel: IChannel | null = await ChannelManager.getById(id);

        if (!currentChannel) throw new ChannelNotFoundError();
        if (currentChannel.isProfile) throw new ProfileEditingIsForbiddenError();

        if (requestingUser === currentChannel.user || isSystemAdmin) {
            isPermitted = true;
        } else {
            const isAdmin: boolean = await UserPermissionsManager.isUserAdmin(requestingUser, id);
            if (isAdmin) isPermitted = true;
        }

        if (!isPermitted) throw new UnauthorizedUserError();

        const removed: IChannel | null = await ChannelRepository.deleteById(id);

        if (removed) {
            ChannelBroker.publish('channelService.channel.remove.succeeded', { id });
        }

        return removed;
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
