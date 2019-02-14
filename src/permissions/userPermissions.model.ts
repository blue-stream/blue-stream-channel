
import * as mongoose from 'mongoose';
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { ChannelValidations } from '../channel/validator/channel.validations';

const userPermissionsSchema: mongoose.Schema = new mongoose.Schema(
    {
        channel: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel',
            required: true,
        },
        user: {
            type: String,
            required: true,
            validate: {
                validator: ChannelValidations.isUserValid,
            },
        },
        permissions: [{
            type: String,
            enum: (<any>Object).values(PermissionTypes),
            required: true,
        }],
    },
    {
        versionKey: false,
        autoIndex: true,
        timestamps: true,
        id: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                delete ret._id;
            },
        },
    });

userPermissionsSchema.index({ channel: 1, user: -1 }, { unique: true });

export const userPermissionsModel = mongoose.model<IUserPermissions & mongoose.Document>('UserPermissions', userPermissionsSchema);
