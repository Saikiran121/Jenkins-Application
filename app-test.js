const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app');
const should = chai.should();

chai.use(chaiHttp);

describe('Deep Sea Explorer API', () => {

    describe('GET /health', () => {
        it('should return health status', (done) => {
            chai.request(app)
                .get('/health')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.eql('Submarine Systems Operational');
                    done();
                });
        });
    });

    describe('GET /species', () => {
        it('should return all species', (done) => {
            chai.request(app)
                .get('/species')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    done();
                });
        });
    });
});
