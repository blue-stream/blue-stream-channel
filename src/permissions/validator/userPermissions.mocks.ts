
import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly channel = {
        id: new Types.ObjectId(),
        user: 'a@a',
        name: 'test channel',
        description: 'test description',
    };

    readonly channel2 = {
        id: new Types.ObjectId(),
        user: 'a@b',
        name: 'test channel 2',
        description: 'test description 2',
    };

    readonly channel3 = {
        id: new Types.ObjectId(),
        user: 'a@c',
        name: 'test channel 3',
        description: 'test description 3',
    };

    readonly channelFilter = this.channel;

    authorizationHeader = `Bearer ${sign({ id: 'a@a' }, config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/channel/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.channel,
        user: { id: 'a@a' },
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/channel/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
        body: {
            description: this.channel.description,
            name: this.channel.name,
        },
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/channel/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/channel/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getMany = createRequest({
        method: 'GET',
        url: '/api/channel/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channel,
    });

    getAmount = createRequest({
        method: 'GET',
        url: '/api/channel/amount',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channel,
    });
}
