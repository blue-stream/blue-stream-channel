
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IChannel } from './channel.interface';
import { IUserPermissions, PermissionTypes } from '../permissions/userPermissions.interface';

import { ChannelRepository } from './channel.repository';
import { UserPermissionsManager } from '../permissions/userPermissions.manager';
import { ChannelManager } from './channel.manager';
import { UnauthorizedUserError } from '../utils/errors/userErrors';

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
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#updateById()', function () {

        let createdChannel: IChannel;

        context('When user has permissions to the channel', function () {
            beforeEach(async function () {
                createdChannel = await ChannelRepository.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should update an existsing channel when user is channel\'s owner', async function () {
                const updatedDoc = await ChannelManager.updateById(createdChannel.id!, channelDataToUpdate, createdChannel.user);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdChannel.id);
                for (const prop in channelDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, channelDataToUpdate[prop as keyof IChannel]);
                }
            });

            it('Should update an existsing channel when user is an admin', async function () {
                const userPermissions: IUserPermissions = {
                    channel: createdChannel.id!,
                    permissions: [PermissionTypes.Admin],
                    user: 'z@t',
                };

                const admin = await UserPermissionsManager.create(userPermissions, createdChannel.user);
                const updatedDoc = await ChannelManager.updateById(createdChannel.id!, channelDataToUpdate, admin.user);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdChannel.id);
                for (const prop in channelDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, channelDataToUpdate[prop as keyof IChannel]);
                }
            });
        });

        context('When user does not have permissions to the channel', function () {
            beforeEach(async function () {
                createdChannel = await ChannelRepository.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should throw UnauthorizedUserError when user is not an owner or admin', async function () {
                let hasThrown = false;

                try {
                    await ChannelManager.updateById(createdChannel.id!, channelDataToUpdate, 'd@dd');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', UnauthorizedUserError.name);
                    expect(err).to.have.property('message', new UnauthorizedUserError().message);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#deleteById()', function () {

        let createdChannel: IChannel;

        context('When user has permissions to the channel', function () {
            beforeEach(async function () {
                createdChannel = await ChannelRepository.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should delete an existsing channel when user is channel\'s owner', async function () {
                const deletedDoc = await ChannelManager.deleteById(createdChannel.id!, createdChannel.user);
                expect(deletedDoc).to.exist;
                expect(deletedDoc).to.have.property('id', createdChannel.id);
            });

            it('Should update an existsing channel when user is an admin', async function () {
                const userPermissions: IUserPermissions = {
                    channel: createdChannel.id!,
                    permissions: [PermissionTypes.Admin],
                    user: 'z@t',
                };

                const admin = await UserPermissionsManager.create(userPermissions, createdChannel.user);
                const deletedDoc = await ChannelManager.deleteById(createdChannel.id!, admin.user);
                expect(deletedDoc).to.exist;
                expect(deletedDoc).to.have.property('id', createdChannel.id);
            });
        });

        context('When user does not have permissions to the channel', function () {
            beforeEach(async function () {
                createdChannel = await ChannelRepository.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should throw UnauthorizedUserError when user is not an owner or admin', async function () {
                let hasThrown = false;

                try {
                    await ChannelManager.deleteById(createdChannel.id!, 'd@dd');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', UnauthorizedUserError.name);
                    expect(err).to.have.property('message', new UnauthorizedUserError().message);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });
});