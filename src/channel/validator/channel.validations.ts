
import { Types } from 'mongoose';
import { config } from '../../config';
export class ChannelValidations {
    public static isUserValid(user: string) {
        const userRegex: RegExp = /\w+@\w+/i;

        return userRegex.test(user);
    }

    public static isNameValid(name: string) {
        return (
            name &&
            name.length <= config.channel.name.maxLength &&
            name.length >= config.channel.name.minLength
        );
    }

    public static isDescriptionValid(description: string) {
        return (
            description &&
            description.length <= config.channel.description.maxLength &&
            description.length >= config.channel.description.minLength
        );
    }

    static isIdValid(id: string): boolean {
        return (!!id && Types.ObjectId.isValid(id));
    }
}
