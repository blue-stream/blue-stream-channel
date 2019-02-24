import { Request, Response } from 'express';
import { ChannelManager } from './channel.manager';

import { ChannelNotFoundError } from '../utils/errors/userErrors';
import { IChannel } from './channel.interface';

export class ChannelController {
    static async create(req: Request, res: Response) {
        const channel = { ...req.body, user: req.user.id };
        res.json(await ChannelManager.create(channel));
    }

    static async updateById(req: Request, res: Response) {
        const updateParams: Partial<IChannel> = {
            name: req.body.name,
            description: req.body.description,
        };

        Object.keys(updateParams).forEach((key: string) => {
            return updateParams[key as keyof IChannel] ===
                undefined && delete updateParams[key as keyof IChannel];
        });

        const updated = await ChannelManager.updateById(req.params.id, updateParams, req.user.id);
        if (!updated) {
            throw new ChannelNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await ChannelManager.deleteById(req.params.id, req.user.id);
        if (!deleted) {
            throw new ChannelNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const channel = await ChannelManager.getById(req.params.id);
        if (!channel) {
            throw new ChannelNotFoundError();
        }

        res.json(channel);
    }

    static async getSearched(req: Request, res: Response) {
        res.json(await ChannelManager.getSearched(req.query.searchFilter, req.query.startIndex, req.query.endIndex, req.query.sortOrder, req.query.sortBy));
    }

    static async getSearchedAmount(req: Request, res: Response) {
        res.json(await ChannelManager.getSearchedAmount(req.query.searchFilter));
    }

    static async getMany(req: Request, res: Response) {
        const channelFilter: Partial<IChannel> = {
            name: req.query.name,
            description: req.query.description,
            user: req.query.user,
        };

        Object.keys(channelFilter).forEach((key: string) => {
            return channelFilter[key as keyof IChannel] ===
                undefined && delete channelFilter[key as keyof IChannel];
        });

        res.json(await ChannelManager.getMany(channelFilter, req.query.startIndex, req.query.endIndex, req.query.sortOrder, req.query.sortBy));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ChannelManager.getAmount(req.query));
    }
}
