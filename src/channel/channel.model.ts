
import * as mongoose from 'mongoose';
import { IChannel } from './channel.interface';
import { ChannelValidations } from './validator/channel.validations';
import { config } from '../config';

const channelSchema: mongoose.Schema = new mongoose.Schema(
    {
        user: {
            type: String,
            required: true,
            validate: {
                validator: ChannelValidations.isUserValid,
            },
        },
        name: {
            type: String,
            required: true,
            minlength: config.channel.name.minLength,
            maxlength: config.channel.name.maxLength,
        },
        description: {
            type: String,
            required: false,
            validator: (value: string) => {
                return ChannelValidations.isDescriptionValid(value);
            },
        },
        isProfile: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
        autoIndex: false,
        timestamps: true,
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    });

channelSchema.index({ name: 1, user: -1 });

export const ChannelModel = mongoose.model<IChannel & mongoose.Document>('Channel', channelSchema);
