const CryptoJS = require("crypto-js");
const	http = require('http');
const	querystring = require('querystring');
const	request = require('request');


class Exmo {
  constructor (config) {
    this.config = Object.assign({
      nonce: Math.floor(new Date().getTime()),
      url: 'https://api.exmo.com/v1/'
    }, config);
  }

  signIn (message) {
    return CryptoJS.HmacSHA512(message, this.config.secret).toString(CryptoJS.enc.hex);
  }

  query (method_name, data) {
    data.nonce = this.config.nonce++;

    let options = {
      url: this.config.url + method_name,
      method: 'POST',
      headers: {
        'Key': this.config.key,
        'Sign': this.signIn( querystring.stringify(data))
      },
      form: data
    };

    return new Promise((resolve, reject) => {
     	request(options, (error, response, body) => {
          if (!error && response.statusCode == 200) {
              resolve(body);
          }else{ reject(error); }
      });
    });
  }
}


module.exports = Exmo;
