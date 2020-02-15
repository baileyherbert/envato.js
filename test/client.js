const { Client, NotFoundError, UnauthorizedError } = require('../dist');
const assert = require('assert');

const { CatalogEndpoints } = require('../dist/endpoints/catalog');
const { PrivateEndpoints } = require('../dist/endpoints/private');
const { StatsEndpoints } = require('../dist/endpoints/stats');
const { UserEndpoints } = require('../dist/endpoints/user');

describe('client', () => {
    let expiration = (new Date()).getTime() + 30000;
    let client = new Client({
        token: 'a',
        refreshToken: 'b',
        expiration: expiration
    });

    it('returns expected values', () => {
        assert(client.token === 'a');
        assert(client.refreshToken === 'b');
        assert(client.expiration === expiration);
    });

    it('returns endpoint helpers', () => {
        assert(client.catalog instanceof CatalogEndpoints);
        assert(client.private instanceof PrivateEndpoints);
        assert(client.stats instanceof StatsEndpoints);
        assert(client.user instanceof UserEndpoints);
    });

    it('properly calculates ttl', () => {
        assert(client.ttl >= 29500 && client.ttl <= 30000);
    });

    it('throws for unauthorized requests', async () => {
        try {
            await client.getIdentity();
            assert.fail('The erroneous request did not throw an error');
        }
        catch (error) {
            assert(error instanceof UnauthorizedError);
        }
    });

    // Short instantiation
    let shortClient = new Client('a');

    it('properly supports short instantiation', () => {
        assert(shortClient.token === 'a');
        assert(typeof shortClient.refreshToken === 'undefined');
    });
});

describe('personal client', () => {
    let client = new Client({
        token: process.env.PERSONAL_TOKEN
    });

    beforeEach((done) => {
        setTimeout(done, 1000);
    });

    it('can retrieve identity', async () => {
        let identity = await client.getIdentity();
        assert(identity.userId === 1908998);
        assert(identity.ttl > 0);
    });

    it('throws for erroneous requests', async () => {
        try {
            await client.get('/v3/not-found');
            assert.fail('The erroneous request did not throw an error');
        }
        catch (error) {
            assert(error instanceof NotFoundError);
        }
    });

    describe('catalog', () => {
        it('can retrieve a collection', async () => {
            let collection = await client.catalog.getCollection(4551957);

            assert(collection.collection.name === 'Free Files of the Month');
            assert(collection.items.length > 0);
            assert(typeof collection.items[0].number_of_sales === 'number');
        });

        it('can retrieve an item', async () => {
            let item = await client.catalog.getItem(2833226);

            assert(item.number_of_sales > 0);
            assert(item.author_username === 'ThemeFusion');
            assert(item.updated_at instanceof Date);
        });

        it('can retrieve market categories', async () => {
            let response = await client.catalog.getCategories('themeforest');

            assert(Array.isArray(response));
            assert(response.length > 0);
            assert(typeof response[0].name === 'string');
        });
    });

    describe('user', () => {
        it('can retrieve account details', async () => {
            let response = await client.user.getAccountDetails('baileyherbert');

            assert(typeof response === 'object');
            assert(response.username === 'baileyherbert');
        });

        it('can retrieve collections', async () => {
            let response = await client.user.getCollections();

            assert(Array.isArray(response));
            assert(response.length > 0);
            assert('name' in response[0]);
        });
    });

    describe('private user', () => {
        it('can retrieve a sale via purchase code', async () => {
            let sale = await client.private.getSale(process.env.PURCHASE_CODE);

            assert(typeof sale === 'object');
            assert('buyer' in sale);
            assert('item' in sale);
            assert('id' in sale.item);
            assert(typeof sale.purchase_count === 'number');
            assert(sale.sold_at instanceof Date);
            assert(sale.supported_until instanceof Date);
        });

        it('returns undefined when looking up an invalid purchase code', async () => {
            try {
                let res = await client.private.getSale('this-does-not-exist');
                assert(typeof res === 'undefined');
            }
            catch (error) {
                assert.fail('unexpectedly threw an error ' + error.toString());
            }
        });

        it('can retrieve username', async () => {
            let response = await client.private.getUsername();
            assert(response === 'baileyherbert');
        });

        it('can retrieve email', async () => {
            let response = await client.private.getEmail();
            assert(response.indexOf('@') > 0);
        });

        it('can retrieve monthly sales', async () => {
            let response = await client.private.getMonthlySales();
            assert(Array.isArray(response));
            assert(response.length > 0);
        });
    });
});
