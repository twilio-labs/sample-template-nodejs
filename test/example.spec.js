const expect = require('chai').expect;
const supertest = require('supertest');
const nock = require('nock');
const app = require('../src/server');
const agent = supertest(app);

// don't let any traffic through to the internet except localhost
nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

nock('https://api.twilio.com')
  .persist()
  .post(/\/2010-04-01\/Accounts\/AC[a-zA-Z0-9]{32}\/Messages.json/)
  .reply(200, {
    account_sid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    api_version: '2010-04-01',
    body: 'Hello test',
    date_created: 'Thu, 30 Jul 2015 20:12:31 +0000',
    date_sent: 'Thu, 30 Jul 2015 20:12:33 +0000',
    date_updated: 'Thu, 30 Jul 2015 20:12:33 +0000',
    direction: 'outbound-api',
    error_code: null,
    error_message: null,
    from: '+12223334444',
    messaging_service_sid: 'MGXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    num_media: '0',
    num_segments: '1',
    price: null,
    price_unit: null,
    sid: 'MMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    status: 'sent',
    subresource_uris: {
      media:
        '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Media.json',
    },
    to: '+15558675310',
    uri:
      '/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Messages/SMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.json',
  });

describe('appointment', () => {
  describe('GET /', () => {
    it('returns index.html', done => {
      agent
        .get('/')
        .expect(response => {
          expect(response.text).to.contain('Template App');
        })
        .expect(200, done);
    });
  });

  describe('GET /example', () => {
    it('returns example data', done => {
      agent
        .get('/example')
        .expect(response => {
          expect(JSON.parse(response.text)).to.eql({
            example: true,
          });
        })
        .expect(200, done);
    });
  });

  describe('POST /send-sms', () => {
    it('sends an sms by calling twilio', done => {
      agent
        .post('/send-sms')
        .send({ to: '+13334445555', body: 'Hello test' })
        .expect(response => {
          expect(JSON.parse(response.text)).to.eql({
            status: 'success',
            message:
              'SMS sent to +13334445555. Message SID: MMXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          });
        })
        .expect(200, done);
    });
  });
});
