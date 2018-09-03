import { Types } from 'mongoose';

export class FeatureNameValidatons {
    static isPropertyValid(property: string): boolean {
        return (!!property && property.length < 10);
    }

    static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }
}
