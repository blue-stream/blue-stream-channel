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

        res.json(await UserPermissionsManager.create(userPermissions, requestingUser));
    }

    static async updateOne(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const permissions: PermissionTypes[] = req.body.permissions;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.updateOne(requestingUser, user, channel, permissions));
    }

    static async deleteOne(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.deleteOne(requestingUser, user, channel));
    }

    static async getOne(req: Request, res: Response) {
        const channel: string = req.query.channel;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getOne(requestingUser, channel));
    }

    static async getMany(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const permission: PermissionTypes = req.query.permission;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getMany(requestingUser, user, channel, permission, req.query.startIndex, req.query.endIndex, req.query.sortOrder, req.query.sortBy));
    }

    static async getAmount(req: Request, res: Response) {
        const user: string = req.query.user;
        const channel: string = req.query.channel;
        const permission: PermissionTypes = req.query.permission;
        const requestingUser: string = req.user.id;

        res.json(await UserPermissionsManager.getAmount(requestingUser, user, channel, permission));
    }
}
