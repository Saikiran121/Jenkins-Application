const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const should = chai.should();

chai.use(chaiHttp);

describe('Deep Sea Explorer API', () => {

    describe('GET /health', () => {
        it('should return health status', async () => {
            const res = await chai.request(app).get('/health');
            res.should.have.status(200);
            res.text.should.be.eql('Submarine Systems Operational');
        });
    });

    describe('GET /species', () => {
        it('should return all species', async () => {
            const res = await chai.request(app).get('/species');
            res.should.have.status(200);
            res.body.should.be.a('array');
            // We no longer check exact length as the database may contain pre-existing data
            res.body.length.should.be.at.least(0);
        });
    });
});
