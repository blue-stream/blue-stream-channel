import { expect } from 'chai';
import { ChannelValidator } from './channel.validator';
import { ValidRequestMocks, responseMock } from './channel.mocks';
import { config } from '../../config';
import { IdInvalidError, UserInvalidError, NameInvalidError, DescriptionInvalidError } from '../../utils/errors/userErrors';

describe('Channel Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an NameInvalidError When name is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.name = undefined;

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When name is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.name = null;

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When name is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.name = '1'.repeat(config.channel.name.maxLength + 1);

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an DescriptionInvalidError When Description is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.description = undefined;

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });

            it('Should throw an DescriptionInvalidError When Description is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.description = null;

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });

            it('Should throw an DescriptionInvalidError When Description is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.description = '1'.repeat(config.channel.description.maxLength + 1);

                ChannelValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });
        });
    });

    describe('UpdateNameById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canUpdateNameById(new ValidRequestMocks().updateNameById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an NameInvalidError When Name is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.body.name = undefined;

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When Name is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.body.name = null;

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an NameInvalidError When Name is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.body.name = '1'.repeat(config.channel.name.maxLength + 1);

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(NameInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.params.id = undefined;

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.params.id = null;

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateNameById;
                invalidRequestMock.params.id = '1244';

                ChannelValidator.canUpdateNameById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('UpdateDescriptionById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canUpdateDescriptionById(new ValidRequestMocks().updateDescriptionById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an DescriptionInvalidError When Description is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.body.description = undefined;

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });

            it('Should throw an DescriptionInvalidError When Description is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.body.description = null;

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });

            it('Should throw an DescriptionInvalidError When Description is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.body.description = '1'.repeat(config.channel.description.maxLength + 1);

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(DescriptionInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.params.id = undefined;

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.params.id = null;

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateDescriptionById;
                invalidRequestMock.params.id = '1244';

                ChannelValidator.canUpdateDescriptionById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canDeleteById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canDeleteById(new ValidRequestMocks().deleteById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                ChannelValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                ChannelValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = '1243';

                ChannelValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canGetById(new ValidRequestMocks().getById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = undefined;

                ChannelValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = null;

                ChannelValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = '1234';

                ChannelValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetAmount Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ChannelValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });
});
