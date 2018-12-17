import { Request, Response, NextFunction } from 'express';
import { ChannelValidations } from './channel.validations';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';
import { IChannel } from '../channel.interface';

export class ChannelValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateProperty(req.body.property));
    }

    
    static canCreateMany(req: Request, res: Response, next: NextFunction) {
        const propertiesValidations: (Error | undefined)[] = req.body.map((channel: IChannel) => {
            return ChannelValidator.validateProperty(channel.property);
        });

        next(ChannelValidator.getNextValueFromArray(propertiesValidations));
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            ChannelValidator.validateId(req.params.id) ||
            ChannelValidator.validateProperty(req.body.property));
    }

    static canUpdateMany(req: Request, res: Response, next: NextFunction) {
        next(ChannelValidator.validateProperty(req.query.property) ||
            ChannelValidator.validateProperty(req.body.property));
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

    private static validateId(id: string) {
        if (!ChannelValidations.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static getNextValueFromArray(validationsArray: (Error | undefined)[]) {
        let nextValue: Error | undefined;

        for (let index = 0; index < validationsArray.length; index++) {
            if (validationsArray[index] !== undefined) {
                nextValue = validationsArray[index];
            }
        }

        return nextValue;
    }

    private static validateProperty(property: string) {
        if (!ChannelValidations.isPropertyValid(property)) {
            return new PropertyInvalidError();
        }

        return undefined;
    }
}
