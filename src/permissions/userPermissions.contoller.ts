import { Request, Response } from 'express';
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { UserPermissionsManager } from './userPermissions.manager';

export class UserPermissionsController {
    static async create(req: Request, res: Response) {
        const userPermissions: IUserPermissions = {
            user: req.body.user,
            channel: req.body.channel,
            permissions: req.body.permissions,
        };
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.create(userPermissions, requestingUser, req.user.isSysAdmin));
    }

    static async updateOne(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const permissions: PermissionTypes[] = req.body.permissions;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.updateOne(requestingUser, user, channel, permissions, req.user.isSysAdmin));
    }

    static async deleteOne(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.deleteOne(requestingUser, user, channel, req.user.isSysAdmin));
    }

    static async getOne(req: Request, res: Response) {
        const channel: string = req.query.channel;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getOne(requestingUser, channel));
    }

    static async getChannelPermittedUsers(req: Request, res: Response) {
        const channel: string = req.params.channelId;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getChannelPermittedUsers(requestingUser, channel, req.query.startIndex, req.query.endIndex, req.query.sortOrder, req.query.sortBy));
    }

    static async getUserPermittedChannels(req: Request, res: Response) {
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getUserPermittedChannels(requestingUser, req.query.permissions, req.query.searchFilter, req.query.startIndex, req.query.endIndex, req.query.sortOrder, req.query.sortBy));
    }

    static async getChannelPermittedUsersAmount(req: Request, res: Response) {
        const channel: string = req.params.channelId;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getChannelPermittedUsersAmount(requestingUser, channel));
    }

    static async getUserPermittedChannelsAmount(req: Request, res: Response) {
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getUserPermittedChannelsAmount(requestingUser));
    }
}
