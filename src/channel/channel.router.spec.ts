import * as request from 'supertest';
import { expect } from 'chai';

import * as mongoose from 'mongoose';
import { IChannel } from './channel.interface';
import { Server } from '../server';
import { IdInvalidError, ChannelNotFoundError, DescriptionInvalidError, NameInvalidError, UserInvalidError } from '../utils/errors/userErrors';
import { config } from '../config';
import { ChannelManager } from './channel.manager';
import { sign } from 'jsonwebtoken';

describe('Channel Router Module', function () {
    let server: Server;
    const validProppertyString: string = '12345';
    const channel: IChannel = {
        id: (new mongoose.Types.ObjectId()).toHexString(),
        user: 'a@a',
        name: 'fake name',
        description: 'fake description',
    };
    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;
    const invalidId: string = '1';
    const invalidProppertyString: string = '123456789123456789';
    const invalidChannel: IChannel = {
        id: '',
        user: 'a',
        name: '1',
        description: '2',
    };

    const channel2: IChannel = {
        id: (new mongoose.Types.ObjectId()).toHexString(),
        user: 'a@b',
        name: 'fake name 2',
        description: 'fake description',
    };

    const channel3: IChannel = {
        id: (new mongoose.Types.ObjectId()).toHexString(),
        user: 'a@c',
        name: 'fake name 3',
        description: 'fake description',
    };

    const unexistingChannel: Partial<IChannel> = {
        id: (new mongoose.Types.ObjectId()).toHexString(),
        user: 'a@c',
        name: 'fake name 4',
        description: 'fake description',
    };

    const channels: IChannel[] =
        [channel, channel2, channel3, channel3];

    const invalidChannels: IChannel[] =
        [channel, invalidChannel, channel3];

    before(async function () {

        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

    after(async function () {
        await mongoose.connection.db.dropDatabase();
    });
    describe('#POST /api/channel/', function () {
        context('When request is valid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return created channel', function (done: MochaDone) {
                request(server.app)
                    .post('/api/channel/')
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('name', channel.name);
                        expect(res.body).to.have.property('user', channel.user);
                        expect(res.body).to.have.property('description', channel.description);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {

            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when user is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/channel/')
                    .send(invalidChannel)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', UserInvalidError.name);
                        expect(res.body).to.have.property('message', new UserInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/channel/:id/name', function () {
        let returnedChannel: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return updated channel', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}/name`)
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('name', channel.name);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${new mongoose.Types.ObjectId()}/name`)
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ChannelNotFoundError.name);
                        expect(res.body).to.have.property('message', new ChannelNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/channel/2/name')
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when name is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}/name`)
                    .send(invalidChannel)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', NameInvalidError.name);
                        expect(res.body).to.have.property('message', new NameInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/channel/:id/description', function () {
        let returnedChannel: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return updated channel', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}/description`)
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('description', channel.description);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${new mongoose.Types.ObjectId()}/description`)
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ChannelNotFoundError.name);
                        expect(res.body).to.have.property('message', new ChannelNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/channel/2/description')
                    .send(channel)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when description is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}/description`)
                    .send(invalidChannel)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', DescriptionInvalidError.name);
                        expect(res.body).to.have.property('message', new DescriptionInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#DELETE /api/channel/:id', function () {
        let returnedChannel: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return updated channel', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/channel/${returnedChannel.id}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('name', channel.name);

                        done();
                    });
            });

            it('Should return error status when id not found', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/channel/${new mongoose.Types.ObjectId()}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ChannelNotFoundError.name);
                        expect(res.body).to.have.property('message', new ChannelNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/channel/${invalidId}`)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/channel/many', function () {
        let returnedChannels: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannels = await ChannelManager.createMany(channels);
            });

            it('Should return channel', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/many?name=${channel3.name}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('name', channels[2].name);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/channel/amount', function () {
        let returnedChannels: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannels = await ChannelManager.createMany(channels);
            });

            it('Should return channel', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/amount?name=${channel3.name}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(2);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/channel/:id', function () {
        let returnedChannel: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return channel', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/${returnedChannel.id}`)

                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('name', channel.name);

                        done();
                    });
            });

            it('Should return error when channel not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/${new mongoose.Types.ObjectId()}`)

                    .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ChannelNotFoundError.name);
                        expect(res.body).to.have.property('message', new ChannelNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/${invalidId}`)

                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });
});
