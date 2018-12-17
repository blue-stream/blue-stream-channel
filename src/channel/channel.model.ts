
import * as mongoose from 'mongoose';
import { IChannel } from './channel.interface';

const channelSchema: mongoose.Schema = new mongoose.Schema(
    {
        property: { type: String, required: true },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const ChannelModel = mongoose.model<IChannel & mongoose.Document>('Channel', channelSchema);
