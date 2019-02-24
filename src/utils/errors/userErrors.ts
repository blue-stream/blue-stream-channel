import { UserError } from './applicationError';

export class UserInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'User is invalid', 400);
    }
}

export class NameInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Name is invalid', 400);
    }
}

export class DescriptionInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Description is invalid', 400);
    }
}

export class IdInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Id is invalid', 400);
    }
}

export class PermissionInvalidError extends UserError {
    constructor(message?: string) {
        super(message || 'Permission is invalid', 400);
    }
}

export class ChannelNotFoundError extends UserError {
    constructor(message?: string) {
        super(message || 'Channel not found', 404);
    }
}

export class UnauthorizedUserError extends UserError {
    constructor(message?: string) {
        super(message || 'User is not authorized to preform this action', 403);
    }
}

export class UserPermissionsAlreadyExistsError extends UserError {
    constructor(message?: string) {
        super(message || 'User already has permissions', 400);
    }
}


export class OwnerPermissionsCanNotBeRemovedError extends UserError {
    constructor(message?: string) {
        super(message || 'Owner\'s permissions can\'t be removed', 400);
    }
}