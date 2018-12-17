
import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validProperty: string = '12345';
    readonly validProperty2: string = '23456';
    readonly validProperty3: string = '34567';

    readonly channel = {
        property: this.validProperty,
    };

    readonly channel2 = {
        property: this.validProperty2,
    };

    readonly channel3 = {
        property: this.validProperty3,
    };

    readonly channelFilter = this.channel;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/channel/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.channel,
    });

    // <MongoDB>

    createMany = createRequest({
        method: 'POST',
        url: '/api/channel/many/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: [
            this.channel,
            this.channel2,
            this.channel3,
        ],
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/channel/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
            id_REMOVE: '12345',
        },
        body: this.channel,
    });

    updateMany = createRequest({
        method: 'PUT',
        url: '/api/channel/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channelFilter,
        body: this.channel,
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

    getOne = createRequest({
        method: 'GET',
        url: `/api/channel/one?channelFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channel,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/channel/many?channelFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channel,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/channel/amount?channelFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.channel,
    });
    // <MongoDB>
}
