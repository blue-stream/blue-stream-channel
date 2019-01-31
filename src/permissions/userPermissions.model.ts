
import * as mongoose from 'mongoose';
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { ChannelValidations } from '../channel/validator/channel.validations';

const userPermissionsSchema: mongoose.Schema = new mongoose.Schema(
    {
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

userPermissionsSchema.index({ user: 1 });

export const userPermissionsModel = mongoose.model<IUserPermissions & mongoose.Document>('UserPermissions', userPermissionsSchema);
