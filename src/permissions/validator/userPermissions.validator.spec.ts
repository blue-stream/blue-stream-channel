import { expect } from 'chai';
import { UserPermissionsValidator } from './userPermissions.validator';
import { ValidRequestMocks, responseMock } from './userPermissions.mocks';
import { config } from '../../config';
import {
    IdInvalidError,
    UserInvalidError,
    UnauthorizedUserError,
    ChannelNotFoundError,
    PermissionInvalidError,
} from '../../utils/errors/userErrors';

describe('Channel Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an UserInvalidError When user is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.user = undefined;

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.user = null;

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.user = '1';

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.channel = undefined;

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.channel = null;

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.channel = '1';

                UserPermissionsValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('UpdateOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canUpdateOne(new ValidRequestMocks().updateOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When channel is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.channel = undefined;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.channel = null;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.channel = '1';

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.user = undefined;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.user = null;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an IdInvalidError When user is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.query.user = '1244';

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an PermissionInvalidError When permissions are undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.body.permissions = undefined;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PermissionInvalidError);
                });
            });

            it('Should throw an PermissionInvalidError When permissions are null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.body.permissions = null;

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PermissionInvalidError);
                });
            });

            it('Should throw an PermissionInvalidError When permissions are invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.body.permissions = ['1'];

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PermissionInvalidError);
                });
            });

            it('Should throw an PermissionInvalidError When permissions are not in the correct format', function () {
                const invalidRequestMock = new ValidRequestMocks().updateOne;
                invalidRequestMock.body.permissions = '1';

                UserPermissionsValidator.canUpdateOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PermissionInvalidError);
                });
            });
        });
    });

    describe('canDeleteOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canDeleteOne(new ValidRequestMocks().deleteOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an UserInvalidError When user is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.user = undefined;

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.user = undefined;

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an UserInvalidError When user is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.user = '1243';

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(UserInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.channel = undefined;

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.channel = undefined;

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteOne;
                invalidRequestMock.query.channel = '1243';

                UserPermissionsValidator.canDeleteOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canGetOne(new ValidRequestMocks().getOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When channel is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().getOne;
                invalidRequestMock.query.channel = undefined;

                UserPermissionsValidator.canGetOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is null', function () {
                const invalidRequestMock = new ValidRequestMocks().getOne;
                invalidRequestMock.query.channel = null;

                UserPermissionsValidator.canGetOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When channel is invalid', function () {
                const invalidRequestMock = new ValidRequestMocks().getOne;
                invalidRequestMock.query.channel = '4';

                UserPermissionsValidator.canGetOne(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetAmount Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                UserPermissionsValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });
});
