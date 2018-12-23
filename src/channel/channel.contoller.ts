import { Request, Response } from 'express';
import { ChannelManager } from './channel.manager';

import { ChannelNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class ChannelController {
    static async create(req: Request, res: Response) {
        res.json(await ChannelManager.create(req.body));
    }

    static async updateNameById(req: Request, res: Response) {
        const updated = await ChannelManager.updateNameById(req.params.id, req.body.name);
        if (!updated) {
            throw new ChannelNotFoundError();
        }

        res.json(updated);
    }

    static async updateDescriptionById(req: Request, res: Response) {
        const updated = await ChannelManager.updateDescriptionById(req.params.id, req.body.description);
        if (!updated) {
            throw new ChannelNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await ChannelManager.deleteById(req.params.id);
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

    static async getMany(req: Request, res: Response) {
        res.json(await ChannelManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ChannelManager.getAmount(req.query));
    }
}
