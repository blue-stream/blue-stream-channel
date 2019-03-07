
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IChannel } from './channel.interface';
import { ChannelRepository } from './channel.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';

const channel: IChannel = {
    id: (new mongoose.Types.ObjectId()).toHexString(),
    user: 'a@a',
    name: 'fake name',
    description: 'fake description',
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

const channelArr: IChannel[] = [channel, channel2, channel3];
const invalidChannel: any = {
    id: '',
    user: 'a',
    name: '1',
    description: '2',
};
const channelFilter: Partial<IChannel> = { name: 'fake name 1' };
const channelDataToUpdate: Partial<IChannel> = { name: 'updated' };
const unexistingChannel: Partial<IChannel> = {
    id: (new mongoose.Types.ObjectId()).toHexString(),
    user: 'a@c',
    name: 'fake name 4',
    description: 'fake description',
};
const unknownProperty: Object = { unknownProperty: true };

describe('Channel Repository', function () {
    before(async function () {
        await mongoose.connect(config.db.connectionString, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        context('When channel is valid', function () {
            it('Should create channel', async function () {
                const createdChannel = await ChannelRepository.create(channel);
                expect(createdChannel).to.exist;
                expect(createdChannel).to.have.property('user', channel.user);
                expect(createdChannel).to.have.property('name', channel.name);
                expect(createdChannel).to.have.property('description', channel.description);
                expect(createdChannel).to.have.property('createdAt');
                expect(createdChannel).to.have.property('updatedAt');
                expect(createdChannel).to.have.property('id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When channel is invalid', function () {
            it('Should throw validation error when incorrect property type', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.create(invalidChannel);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/Validator.+failed/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('name');
                    expect(err.errors.name).to.have.property('name', 'ValidatorError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when empty channel passed', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.create({} as IChannel);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown);
                }
            });
        });
    });

    describe('#createMany()', function () {
        context('When data is valid', function () {
            it('Should create many documents', async function () {
                const createdDocuments = await ChannelRepository.createMany(channelArr);

                expect(createdDocuments).to.exist;
                expect(createdDocuments).to.be.an('array');
                expect(createdDocuments).to.have.lengthOf(channelArr.length);
            });

            it('Should not create documents when empty array passed', async function () {
                const docs = await ChannelRepository.createMany([]);

                expect(docs).to.exist;
                expect(docs).to.be.an('array');
                expect(docs).to.be.empty;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when 1 of the docs invalid', async function () {
                let hasThrown = false;
                const docs: IChannel[] = [
                    ...channelArr,
                    {} as IChannel,
                ];

                try {
                    await ChannelRepository.createMany(docs);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateById()', function () {

        let createdChannel: IChannel;

        beforeEach(async function () {
            createdChannel = await ChannelRepository.create(channel);
            expect(createdChannel).have.property('id');
        });

        context('When data is valid', function () {

            it('Should update an existsing channel', async function () {
                const updatedDoc = await ChannelRepository.updateById(createdChannel.id!, channelDataToUpdate);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdChannel.id);
                for (const prop in channelDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, channelDataToUpdate[prop as keyof IChannel]);
                }
            });

            it('Should not update an existing channel when empty data provided', async function () {
                const updatedDoc = await ChannelRepository.updateById(createdChannel.id!, {});
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdChannel.id);

                for (const prop in channel) {
                    expect(updatedDoc).to.have.property(prop, createdChannel[prop as keyof IChannel]);
                }
            });

            it('Should return null when updated doc does does not exist', async function () {
                const updatedDoc = await ChannelRepository.updateById(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.updateById(createdChannel.id as string, { name: null } as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateMany()', function () {

        beforeEach(async function () {
            await ChannelRepository.createMany(channelArr);
        });

        context('When data is valid', function () {

            it('Should update many documents', async function () {
                const updated = await ChannelRepository.updateMany(channelFilter, channelDataToUpdate);

                const amountOfRequiredUpdates = channelArr.filter((item: IChannel) => {
                    let match = true;
                    for (const prop in channelFilter) {
                        match = match && item[prop as keyof IChannel] === channelFilter[prop as keyof IChannel];
                    }

                    return match;
                }).length;

                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', amountOfRequiredUpdates);

                const documents = await ChannelRepository.getMany(channelDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(amountOfRequiredUpdates);
            });

            it('Should update all documents when no filter passed', async function () {
                const updated = await ChannelRepository.updateMany({}, channelDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', channelArr.length);

                const documents = await ChannelRepository.getMany(channelDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(channelArr.length);
            });

            it('Should do nothing when criteria does not match any document', async function () {
                const updated = await ChannelRepository.updateMany(unexistingChannel, channelDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', 0);

                const documents = await ChannelRepository.getMany(channelDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });

        });

        context('When data is invalid', function () {

            it('Should throw error when empty data provided', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.updateMany(channelFilter, {});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should not update documents when invalid data passed', async function () {
                await ChannelRepository.updateMany({}, unknownProperty);

                const documents = await ChannelRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.satisfy((documents: IChannel[]) => {
                    documents.forEach((doc: IChannel) => {
                        for (const prop in unknownProperty) {
                            expect(doc).to.not.have.property(prop);
                        }
                    });

                    return true;
                });
            });
        });
    });

    describe('#deleteById()', function () {

        let document: IChannel;

        beforeEach(async function () {
            document = await ChannelRepository.create(channel);
        });

        context('When data is valid', function () {

            it('Should delete document by id', async function () {
                const deleted = await ChannelRepository.deleteById(document.id!);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('id', document.id);

                const doc = await ChannelRepository.getById(document.id!);
                expect(doc).to.not.exist;
            });

            it('Should return null when document does not exist', async function () {
                const deleted = await ChannelRepository.deleteById(new mongoose.Types.ObjectId().toHexString());
                expect(deleted).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in the correct format', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.deleteById('invalid id');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'CastError');
                    expect(err).to.have.property('kind', 'ObjectId');
                    expect(err).to.have.property('path', '_id');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getById()', function () {

        context('When data is valid', function () {

            let document: IChannel;
            beforeEach(async function () {
                document = await ChannelRepository.create(channel);
            });

            it('Should return document by id', async function () {
                const doc = await ChannelRepository.getById(document.id!);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in channel) {
                    if (prop !== 'id') {
                        expect(doc).to.have.property(prop, channel[prop as keyof IChannel]);
                    }
                }
            });

            it('Should return null when document does not exist', async function () {
                const doc = await ChannelRepository.getById(validId);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.getById(invalidId);
                } catch (err) {
                    hasThrown = true;

                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ChannelRepository.createMany(channelArr);
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await ChannelRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(channelArr.length);
            });

            it('Should return only matching documents', async function () {
                const documents = await ChannelRepository.getMany(channelFilter);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');

                const amountOfRequiredDocuments = channelArr.filter((item: IChannel) => {
                    let match = true;
                    for (const prop in channelFilter) {
                        match = match && item[prop as keyof IChannel] === channelFilter[prop as keyof IChannel];
                    }

                    return match;
                }).length;

                expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await ChannelRepository.getMany(unexistingChannel);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await ChannelRepository.getMany(0 as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return empty array when filter is not in correct format', async function () {
                const documents = await ChannelRepository.getMany(unknownProperty);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ChannelRepository.createMany(channelArr);
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await ChannelRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(channelArr.length);
            });

            it('Should return amount of filtered documents', async function () {
                const amount = await ChannelRepository.getAmount(channelFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');

                const amountOfRequiredDocuments = channelArr.filter((item: IChannel) => {
                    let match = true;
                    for (const prop in channelFilter) {
                        match = match && item[prop as keyof IChannel] === channelFilter[prop as keyof IChannel];
                    }

                    return match;
                }).length;

                expect(amount).to.equal(amountOfRequiredDocuments);
            });

            it('Should return 0 when no documents matching filter', async function () {
                const amount = await ChannelRepository.getAmount(unexistingChannel);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });

        context('When data is invalid', function () {
            it('Should return 0 when filter is not in the correct format', async function () {
                const amount = await ChannelRepository.getAmount(unknownProperty);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });
    });
});
