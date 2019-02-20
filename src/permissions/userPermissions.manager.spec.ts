
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { IChannel } from '../channel/channel.interface';
import { IUserPermissions, PermissionTypes } from './userPermissions.interface';
import { UserPermissionsManager } from './userPermissions.manager';
import { ChannelManager } from '../channel/channel.manager';
import { UnauthorizedUserError, UserPermissionsAlredyExistsError, OwnerPermissionsCanNotBeRemovedError } from '../utils/errors/userErrors';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';

const randomUser: string = 'z@z';
const channelOwner: string = 'a@a';

const channel: IChannel = {
    name: 'test',
    user: channelOwner,
    description: 'test desc',
};

const userPermissions1: IUserPermissions = {
    user: randomUser,
    channel: (new mongoose.Types.ObjectId()).toHexString(),
    permissions: [PermissionTypes.Admin],
};

const userPermissions2: IUserPermissions = {
    user: 'a@b',
    channel: (new mongoose.Types.ObjectId()).toHexString(),
    permissions: [PermissionTypes.Admin],
};

const userPermissions3: IUserPermissions = {
    user: 'a@c',
    channel: (new mongoose.Types.ObjectId()).toHexString(),
    permissions: [PermissionTypes.Edit],
};

const userPermissionsDataToUpdate: Partial<IUserPermissions> = { permissions: [PermissionTypes.Remove] };

describe('User Permissions Manager', function () {
    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        let createdChannel: IChannel;

        context('When User Permissions are valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should create UserPermissions when user is channel\'s owner', async function () {
                const createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions1, channel: createdChannel.id! }, channel.user);
                expect(createdUserPermissions).to.exist;
                expect(createdUserPermissions).to.have.property('user', userPermissions1.user);
                expect(createdUserPermissions.channel.toString()).to.equal(createdChannel.id);
                expect(createdUserPermissions.permissions).to.contain(userPermissions1.permissions[0]);
            });

            it('Should create UserPermissions when user is channel\'s admin', async function () {
                const admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                const createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions3, channel: createdChannel.id! }, admin.user);
                expect(createdUserPermissions).to.exist;
                expect(createdUserPermissions).to.have.property('user', userPermissions3.user);
                expect(createdUserPermissions.channel.toString()).to.equal(createdChannel.id);
                expect(createdUserPermissions.permissions).to.contain(userPermissions3.permissions[0]);
            });

            it('Should not create UserPermissions when user already has permissions to the channel', async function () {
                const createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions1, channel: createdChannel.id! }, channel.user);
                expect(createdUserPermissions).to.exist;
                expect(createdUserPermissions).to.have.property('user', userPermissions1.user);
                expect(createdUserPermissions.channel.toString()).to.equal(createdChannel.id);
                expect(createdUserPermissions.permissions).to.contain(userPermissions1.permissions[0]);

                let hasThrown = false;

                try {
                    await UserPermissionsManager.create({ ...userPermissions1, channel: createdChannel.id! }, channel.user);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', UserPermissionsAlredyExistsError.name);
                    expect(err).to.have.property('message', new UserPermissionsAlredyExistsError().message);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });

        context('When User Permissions are invalid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                expect(createdChannel).have.property('id');
            });

            it('Should throw UnauthorizedUserError when requestingUser is not an Admin or owner', async function () {
                let hasThrown = false;

                try {
                    await UserPermissionsManager.create({ ...userPermissions1, channel: createdChannel.id! }, randomUser);
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

    describe('#updateOne()', function () {

        let createdChannel: IChannel;
        let createdUserPermissions: IUserPermissions;
        let admin: IUserPermissions;

        context('When data is valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                expect(createdChannel).have.property('id');

                admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                expect(admin).have.property('user', userPermissions2.user);

                createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions3, channel: createdChannel.id! }, admin.user);
                expect(createdUserPermissions).have.property('user', userPermissions3.user);
            });

            it('Should update an existsing userPermissions when requestingUser is admin', async function () {
                const updatedDoc = await UserPermissionsManager.updateOne(admin.user, createdUserPermissions.user, createdChannel.id!, userPermissionsDataToUpdate.permissions!);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('user', userPermissions3.user);
                expect(updatedDoc).to.have.property('permissions');
                expect(updatedDoc!.permissions).to.contain(userPermissionsDataToUpdate.permissions![0]);
            });

            it('Should update an existsing userPermissions when requestingUser is channel\'s owner', async function () {
                const updatedDoc = await UserPermissionsManager.updateOne(createdChannel.user, createdUserPermissions.user, createdChannel.id!, userPermissionsDataToUpdate.permissions!);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('user', userPermissions3.user);
                expect(updatedDoc).to.have.property('permissions');
                expect(updatedDoc!.permissions).to.contain(userPermissionsDataToUpdate.permissions![0]);
            });
        });
        context('When data is not valid', function () {
            it('Should throw UnauthorizedUserError when requestingUser is not an Admin or owner', async function () {
                let hasThrown = false;

                try {
                    const updatedDoc = await UserPermissionsManager.updateOne(randomUser, createdUserPermissions.user, createdChannel.id!, userPermissionsDataToUpdate.permissions!);
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

    describe('#deleteOne()', function () {

        let createdChannel: IChannel;
        let createdUserPermissions: IUserPermissions;
        let admin: IUserPermissions;

        context('When data is valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                expect(createdChannel).have.property('id');

                admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                expect(admin).have.property('user', userPermissions2.user);

                createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions3, channel: createdChannel.id! }, admin.user);
                expect(createdUserPermissions).have.property('user', userPermissions3.user);
            });

            it('Should delete User Permissions by user and channel when requesting user is admin', async function () {
                const deleted = await UserPermissionsManager.deleteOne(admin.user, createdUserPermissions.user, createdUserPermissions.channel);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('user', createdUserPermissions.user);
            });

            it('Should delete User Permissions by user and channel when requesting user is owner', async function () {
                const deleted = await UserPermissionsManager.deleteOne(createdChannel.user, createdUserPermissions.user, createdUserPermissions.channel);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('user', createdUserPermissions.user);
            });

            it('Should return null when user does not have permissions to the channel', async function () {
                const deleted = await UserPermissionsManager.deleteOne(createdChannel.user, randomUser, createdUserPermissions.channel);
                expect(deleted).to.be.null;
            });
            it('Should throw UnauthorizedUserError when user is the owner', async function () {
                let hasThrown = false;

                try {
                    await UserPermissionsManager.deleteOne(admin.user, createdChannel.user, createdUserPermissions.channel);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', OwnerPermissionsCanNotBeRemovedError.name);
                    expect(err).to.have.property('message', new OwnerPermissionsCanNotBeRemovedError().message);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });

        context('When data is invalid', function () {
            it('Should throw UnauthorizedUserError when requestingUser is not an Admin or owner', async function () {
                let hasThrown = false;

                try {
                    await UserPermissionsManager.deleteOne(randomUser, createdUserPermissions.user, createdUserPermissions.channel);
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

    describe('#getOne()', function () {
        let createdChannel: IChannel;
        let createdUserPermissions: IUserPermissions;
        let admin: IUserPermissions;

        context('When data is valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                expect(createdChannel).have.property('id');

                admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                expect(admin).have.property('user', userPermissions2.user);

                createdUserPermissions = await UserPermissionsManager.create({ ...userPermissions3, channel: createdChannel.id! }, admin.user);
                expect(createdUserPermissions).have.property('user', userPermissions3.user);
            });

            it('Should return document by id', async function () {
                const doc = await UserPermissionsManager.getOne(createdUserPermissions.user, createdUserPermissions.channel);
                expect(doc).to.exist;
                expect(doc).to.have.property('user', createdUserPermissions.user);
                expect(doc).to.have.property('channel');
                expect(doc!.channel.toString()).to.be.equal(createdUserPermissions.channel.toString());
            });

            it('Should return null when document does not exist', async function () {
                const doc = await UserPermissionsManager.getOne(randomUser, createdUserPermissions.channel);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                let hasThrown = false;

                try {
                    await UserPermissionsManager.getOne('d', 'd');
                } catch (err) {
                    hasThrown = true;

                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getChannelPermittedUsers()', function () {
        let createdChannel: IChannel;
        let randomChannel: IChannel;

        let createdUserPermissions1: IUserPermissions;
        let createdUserPermissions2: IUserPermissions;
        let createdUserPermissions3: IUserPermissions;
        let createdUserPermissions4: IUserPermissions;

        let admin: IUserPermissions;

        context('When data is valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                randomChannel = await ChannelManager.create(channel);

                expect(createdChannel).have.property('id');
                expect(randomChannel).have.property('id');

                admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                expect(admin).have.property('user', userPermissions2.user);

                createdUserPermissions1 = await UserPermissionsManager.create({ user: 'd@a', channel: createdChannel.id!, permissions: [PermissionTypes.Remove] }, admin.user);
                createdUserPermissions2 = await UserPermissionsManager.create({ user: 'd@b', channel: createdChannel.id!, permissions: [PermissionTypes.Edit] }, admin.user);
                createdUserPermissions3 = await UserPermissionsManager.create({ user: 'd@c', channel: createdChannel.id!, permissions: [PermissionTypes.Upload] }, admin.user);
                createdUserPermissions4 = await UserPermissionsManager.create({ user: 'd@d', channel: randomChannel.id!, permissions: [PermissionTypes.Upload] }, randomChannel.user);

                expect(createdUserPermissions1).have.property('user', 'd@a');
                expect(createdUserPermissions2).have.property('user', 'd@b');
                expect(createdUserPermissions3).have.property('user', 'd@c');
                expect(createdUserPermissions4).have.property('user', 'd@d');
            });

            it('Should return all users that have permissions to the channel', async function () {
                const documents = await UserPermissionsManager.getChannelPermittedUsers(admin.user, createdChannel.id!);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(5);
            });
        });
    });

    describe('#getUserPermittedChannels()', function () {
        context('When data is valid', function () {
            beforeEach(async function () {
                await ChannelManager.create(channel);
                await ChannelManager.create(channel);
                await ChannelManager.create(channel);
            });

            it('Should return all channels that the user have permissions to', async function () {
                const documents = await UserPermissionsManager.getUserPermittedChannels(channel.user, PermissionTypes.Admin, '');
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(3);
            });
        });
    });

    describe('#getChannelPermittedUsersAmount()', function () {
        let createdChannel: IChannel;
        let randomChannel: IChannel;

        let createdUserPermissions1: IUserPermissions;
        let createdUserPermissions2: IUserPermissions;
        let createdUserPermissions3: IUserPermissions;
        let createdUserPermissions4: IUserPermissions;

        let admin: IUserPermissions;

        context('When data is valid', function () {
            beforeEach(async function () {
                createdChannel = await ChannelManager.create(channel);
                randomChannel = await ChannelManager.create(channel);

                expect(createdChannel).have.property('id');
                expect(randomChannel).have.property('id');

                admin = await UserPermissionsManager.create({ ...userPermissions2, channel: createdChannel.id! }, channel.user);
                expect(admin).have.property('user', userPermissions2.user);

                createdUserPermissions1 = await UserPermissionsManager.create({ user: 'd@a', channel: createdChannel.id!, permissions: [PermissionTypes.Remove] }, admin.user);
                createdUserPermissions2 = await UserPermissionsManager.create({ user: 'd@b', channel: createdChannel.id!, permissions: [PermissionTypes.Edit] }, admin.user);
                createdUserPermissions3 = await UserPermissionsManager.create({ user: 'd@c', channel: createdChannel.id!, permissions: [PermissionTypes.Upload] }, admin.user);
                createdUserPermissions4 = await UserPermissionsManager.create({ user: 'd@d', channel: randomChannel.id!, permissions: [PermissionTypes.Upload] }, randomChannel.user);

                expect(createdUserPermissions1).have.property('user', 'd@a');
                expect(createdUserPermissions2).have.property('user', 'd@b');
                expect(createdUserPermissions3).have.property('user', 'd@c');
                expect(createdUserPermissions4).have.property('user', 'd@d');
            });

            it('Should return all amount of users that have permissions to the channel', async function () {
                const documents = await UserPermissionsManager.getChannelPermittedUsersAmount(admin.user, createdChannel.id!);
                expect(documents).to.exist;
                expect(documents).to.be.an('number');
                expect(documents).to.be.equal(5);
            });
        });
    });

    describe('#getUserPermittedChannelsAmount()', function () {
        context('When data is valid', function () {
            beforeEach(async function () {
                await ChannelManager.create(channel);
                await ChannelManager.create(channel);
                await ChannelManager.create(channel);
            });

            it('Should return amount of channels that the user have permissions to', async function () {
                const documents = await UserPermissionsManager.getUserPermittedChannelsAmount(channel.user);
                expect(documents).to.exist;
                expect(documents).to.be.an('number');
                expect(documents).to.be.equal(3);
            });
        });
    });

});
