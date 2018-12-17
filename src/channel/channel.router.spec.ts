import * as request from 'supertest';
import { expect } from 'chai';

import * as mongoose from 'mongoose';
import { IChannel } from './channel.interface';
import { Server } from '../server';
import { PropertyInvalidError, IdInvalidError, ChannelNotFoundError } from '../utils/errors/userErrors';
import { config } from '../config';
import { ChannelManager } from './channel.manager';
import { sign } from 'jsonwebtoken';

describe('Channel Router Module', function () {
    let server: Server;
    const validProppertyString: string = '12345';
    const channel: IChannel = {
        property: validProppertyString,
    };
    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;
    const invalidId: string = '1';
    const invalidProppertyString: string = '123456789123456789';
    const invalidChannel: IChannel = {
        property: invalidProppertyString,
    };
    

    const channel2: IChannel = {
        property: '45678',
    };
    const channel3: IChannel = {
        property: '6789',
    };

    const unexistingChannel: IChannel = {
        property: 'a',
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
                        expect(res.body).to.have.property('property', validProppertyString);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when property is invalid', function (done: MochaDone) {
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
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });
    
    describe('#POST /api/channel/many/', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return created channel', function (done: MochaDone) {
                request(server.app)
                    .post('/api/channel/many/')
                    .send(channels)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', channels[1].property);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/channel/many/')
                    .send(invalidChannels)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/channel/many', function () {
        let returnedChannels: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannels = await ChannelManager.createMany(channels);
            });

            it('Should return updated channel', function (done: MochaDone) {
                request(server.app)
                    .put('/api/channel/many')
                    .query(channel)
                    .send(channel2)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('ok', 1);
                        expect(res.body).to.have.property('nModified', 1);

                        done();
                    });
            });

            it('Should return 404 error status code', function (done: MochaDone) {
                request(server.app)
                    .put('/api/channel/many')
                    .query(unexistingChannel)
                    .send(channel)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(404)
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
                returnedChannels = await ChannelManager.createMany(channels);
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/channel/many')
                    .query(channel2)
                    .send(invalidChannel)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/channel/:id', function () {
        let returnedChannel: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannel = await ChannelManager.create(channel);
            });

            it('Should return updated channel', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}`)
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
                        expect(res.body).to.have.property('property', channel.property);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${new mongoose.Types.ObjectId()}`)
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
                    .put('/api/channel/2')
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

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/channel/${returnedChannel.id}`)
                    .send(invalidChannel)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

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
                        expect(res.body).to.have.property('property', channel.property);

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

    describe('#GET /api/channel/one', function () {
        let returnedChannels: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedChannels = await ChannelManager.createMany(channels);
            });

            it('Should return channel', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/one?property=${channel3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', channels[2].property);

                        done();
                    });
            });

            it('Should return error when channel not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/channel/one?property=${unexistingChannel.property}`)
                    
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
                    .get(`/api/channel/many?property=${channel3.property}`)
                    
                    .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', channels[2].property);

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
                    .get(`/api/channel/amount?property=${channel3.property}`)
                    
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
                        expect(res.body).to.have.property('property', channel.property);

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
