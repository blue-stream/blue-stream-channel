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

export class ChannelNotFoundError extends UserError {
    constructor(message?: string) {
        super(message || 'Channel not found', 404);
    }
}
