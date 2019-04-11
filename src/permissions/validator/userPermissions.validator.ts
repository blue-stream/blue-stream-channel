import { Request, Response, NextFunction } from 'express';
import { UserPermissionsValidations } from './userPermissions.validations';
import { ChannelValidations } from '../../channel/validator/channel.validations';
import { ChannelValidator } from '../../channel/validator/channel.validator';
import { IdInvalidError, DescriptionInvalidError, NameInvalidError, UserInvalidError, PermissionInvalidError } from '../../utils/errors/userErrors';
import { PermissionTypes } from '../userPermissions.interface';

export class UserPermissionsValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateUser(req.body.user) ||
            ChannelValidator.validateUser(req.user.id) ||
            ChannelValidator.validateId(req.body.channel) ||
            UserPermissionsValidator.validatePermissions(req.body.permissions),
        );
    }

    static canUpdateOne(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.query.channel) ||
            ChannelValidator.validateUser(req.query.user) ||
            ChannelValidator.validateUser(req.user.id) ||
            UserPermissionsValidator.validatePermissions(req.body.permissions));
    }

    static canDeleteOne(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.query.channel) ||
            ChannelValidator.validateUser(req.query.user) ||
            ChannelValidator.validateUser(req.user.id),
        );
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateUser(req.user.id) ||
            ChannelValidator.validateId(req.query.channel),
        );
    }

    static canGetUserPermittedChannels(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateUser(req.user.id));
    }

    static canGetChannelPermittedUsers(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateUser(req.user.id) ||
            ChannelValidator.validateId(req.params.channelId),
        );
    }

    static canGetChannelAdmins(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.params.channelId),
        );
    }

    static canGetIsUserAdmin(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.params.channelId),
        );
    }

    static canGetUserPermittedChannelsAmount(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateUser(req.user.id));
    }

    static canGetChannelPermittedUsersAmount(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateUser(req.user.id) ||
            ChannelValidator.validateId(req.params.channelId),
        );
    }

    static validatePermissions(permissions: PermissionTypes[] | PermissionTypes) {
        let permissionsToValidate: PermissionTypes[] = [];

        if (Array.isArray(permissions)) {
            permissionsToValidate = permissions;
        } else {
            permissionsToValidate = [permissions];
        }

        for (let permissionIndex = 0; permissionIndex < permissionsToValidate.length; permissionIndex++) {
            if (!UserPermissionsValidations.isPermission(permissionsToValidate[permissionIndex])) {
                return new PermissionInvalidError();
            }
        }

        return undefined;
    }
}
