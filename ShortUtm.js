const Rubik = require('rubik-main');
const promisify = require('util').promisify;

const request = promisify(require('request'));

class Report extends Rubik.Kubik {
  constructor () {
    super();
    this.name = 'shortUtm';
    this.dependencies = ['config', 'log']
  }

  async get({ short, readToken }) {
    if (!readToken) readToken = this._readToken;
    if (!readToken) throw new Error('readToken is not defined');

    const options = {
      url: `${this._host}/api/utm?short=${short}`,
      method: 'GET',
      headers: { 'x-application-token': readToken }
    }

    const result = await request(options);

    try {
      result.body = JSON.parse(result.body);
    } catch (err) {
      console.info(result.body)
      throw err;
    }

    if (result.body.error) throw new Error(result.body.error);
    if (result.statusCode !== 200) throw new Error('statusCode is not 200');

    return result.body;
  }

  async up({ config, log }) {
    const thisKubikConfig = config.get('shortUtm');
    this._host = thisKubikConfig.host;
    this._readToken = thisKubikConfig.readToken;

    if (!this._host) throw new Error('host is required for shortUtm Kubik');

    Object.assign(this, { config, log });
  }
}

module.exports = Report;
