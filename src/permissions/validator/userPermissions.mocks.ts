
import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';
import { PermissionTypes } from '../userPermissions.interface';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly userPermissions = {
        user: 'a@a',
        channel: '5c3dd5072caef6001fd9b990',
        permissions: [PermissionTypes.Admin],
    };

    readonly userPermissions2 = {
        user: 'a@b',
        channel: '5c3dd5072caef6001fd9b991',
        permissions: [PermissionTypes.Remove, PermissionTypes.Upload],
    };

    readonly userPermissions3 = {
        user: 'a@c',
        channel: '5c3dd5072caef6001fd9b992',
        permissions: [PermissionTypes.Edit],
    };

    readonly channelFilter = this.userPermissions;

    authorizationHeader = `Bearer ${sign({ id: 'a@a' }, config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/channel/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.userPermissions,
        user: { id: 'a@a' },
    });

    updateOne = createRequest({
        method: 'PUT',
        url: '/api/channel',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: {
            channel: new Types.ObjectId(),
            user: 'c@b',
        },
        body: {
            permissions: this.userPermissions.permissions,
        },
        user: { id: 'a@a' },
    });

    deleteOne = createRequest({
        method: 'DELETE',
        url: '/api/channel/',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: {
            channel: new Types.ObjectId(),
            user: 'c@b',
        },
        user: { id: 'a@a' },
    });

    getOne = createRequest({
        method: 'GET',
        url: '/api/channel/one',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: {
            channel: new Types.ObjectId(),
        },
        user: { id: 'a@a' },
    });

    getMany = createRequest({
        method: 'GET',
        url: '/api/channel/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.userPermissions,
        user: { id: 'a@a' },
    });

    getAmount = createRequest({
        method: 'GET',
        url: '/api/channel/amount',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.userPermissions,
        user: { id: 'a@a' },
    });
}
