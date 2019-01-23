import { Request, Response, NextFunction } from 'express';
import { ChannelValidations } from './channel.validations';
import { IdInvalidError, DescriptionInvalidError, NameInvalidError, UserInvalidError } from '../../utils/errors/userErrors';

export class ChannelValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateUser(req.user.id) ||
            ChannelValidator.validateName(req.body.name) ||
            ChannelValidator.validateDescription(req.body.description),
        );
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.params.id) ||
            ChannelValidator.validateDescription(req.body.description) ||
            ChannelValidator.validateName(req.body.name));
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetSearched(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetSearchedAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateId(id: string) {
        if (!ChannelValidations.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static validateUser(user: string) {
        if (!ChannelValidations.isUserValid(user)) {
            return new UserInvalidError();
        }

        return undefined;
    }

    private static validateName(name: string) {
        if (!ChannelValidations.isNameValid(name)) {
            return new NameInvalidError();
        }

        return undefined;
    }

    private static validateDescription(description: string) {
        if (!ChannelValidations.isDescriptionValid(description)) {
            return new DescriptionInvalidError();
        }

        return undefined;
    }
}
