const { Client, NotFoundError, UnauthorizedError } = require('../dist');
const { equal } = require('assert');
const { expect } = require('chai');

const { CatalogClientGroup } = require('../dist/client/catalog');
const { PrivateClientGroup } = require('../dist/client/private');
const { StatsClientGroup } = require('../dist/client/stats');
const { UserClientGroup } = require('../dist/client/user');

describe('client', () => {
    let expiration = (new Date()).getTime() + 30000;
    let client = new Client({
        token: 'a',
        refreshToken: 'b',
        expiration: expiration
    });

    it('returns expected values', () => {
        equal(client.token, 'a');
        equal(client.refreshToken, 'b');
        equal(client.expiration, expiration);
    });

    it('returns endpoint helpers', () => {
        expect(client.catalog).to.be.instanceOf(CatalogClientGroup);
        expect(client.private).to.be.instanceOf(PrivateClientGroup);
        expect(client.stats).to.be.instanceOf(StatsClientGroup);
        expect(client.user).to.be.instanceOf(UserClientGroup);
    });

    it('properly calculates ttl', () => {
        expect(client.ttl).to.be.within(28000, 30000);
    });

    it('throws for unauthorized requests', async () => {
        try {
            await client.getIdentity();
            fail('The erroneous request did not throw an error');
        }
        catch (error) {
            expect(error).to.be.instanceOf(UnauthorizedError);
        }
    });

    // Short instantiation
    let shortClient = new Client('a');

    it('properly supports short instantiation', () => {
        equal(shortClient.token, 'a');
    });
});

describe('personal client', () => {
    let client = new Client({
        token: process.env.PERSONAL_TOKEN
    });

    beforeEach((done) => {
        setTimeout(done, 3000);
    });

    it('can retrieve identity', async () => {
        let identity = await client.getIdentity();
        expect(identity.userId).to.equal(1908998, 'The returned user ID does not match the expected value (1908998)');
        expect(identity.ttl).to.be.greaterThan(0, 'Got a faulty ttl');
    });

    it('throws for erroneous requests', async () => {
        try {
            await client.get('/v3/not-found');
            fail('The erroneous request did not throw an error');
        }
        catch (error) {
            expect(error).to.be.instanceOf(NotFoundError);
        }
    });

    describe('catalog', () => {
        it('can retrieve a collection', async () => {
            let collection = await client.catalog.getCollection(4551957);

            expect(collection.collection.name).to.equal('Free Files of the Month');
            expect(collection.items).length.to.be.greaterThan(1);
            expect(collection.items[0].number_of_sales).to.be.a('number');
        });

        it('can retrieve an item', async () => {
            let item = await client.catalog.getItem(2833226);

            expect(item.number_of_sales).to.be.greaterThan(0);
            expect(item.author_username).to.equal('ThemeFusion');
        });

        it('can retrieve market categories', async () => {
            let response = await client.catalog.getCategories('themeforest');

            expect(response).to.be.an('array').that.is.not.empty;
            expect(response[0].name).to.be.a('string');
        });
    });

    describe('user', () => {
        it('can retrieve account details', async () => {
            let response = await client.user.getAccountDetails('baileyherbert');

            expect(response).to.be.an('object');
            expect(response.username).to.equal('baileyherbert');
        });

        it('can retrieve collections', async () => {
            let response = await client.user.getCollections();

            expect(response).to.be.an('array').that.is.not.empty;
            expect(response[0]).to.have.property('name');
        });
    });

    describe('private user', () => {
        it('can retrieve a sale via purchase code', async () => {
            let sale = await client.private.getSale(process.env.PURCHASE_CODE);

            expect(sale).to.be.an('object');
            expect(sale).to.have.property('buyer');
            expect(sale).to.have.nested.property('item.id');
            expect(sale.purchase_count).to.be.a('number');
        });

        it('returns undefined when looking up an invalid purchase code', async () => {
            try {
                let res = await client.private.getSale('this-does-not-exist');
                expect(res).to.equal(undefined);
            }
            catch (error) {
                expect.fail('unexpectedly threw an error ' + error.toString());
            }
        });

        it('can retrieve username', async () => {
            let response = await client.private.getUsername();
            expect(response).to.equal('baileyherbert');
        });

        it('can retrieve email', async () => {
            let response = await client.private.getEmail();
            expect(response).to.have.string('@');
        });

        it('can retrieve monthly sales', async () => {
            let response = await client.private.getMonthlySales();
            expect(response).to.be.an('array').that.is.not.empty;
        });
    });
});
