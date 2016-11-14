/**
 * Created by behnamhajian on 2016-11-10.
 */

var fs = require('fs');
var path = require('path');
var mqtt = require('mqtt');
var path = require('path');
var projectRoot = path.resolve(__dirname, '../..');

module.exports = function (loopbackApplication, options) {

  var _KEY = fs.readFileSync(path.resolve(projectRoot, 'certs', 'client2.key'));
  var _CERT = fs.readFileSync(path.resolve(projectRoot, 'certs', 'client2.crt'));
  var _TRUSTED_CA_LIST = [ fs.readFileSync(path.resolve(projectRoot, 'certs', 'ca.crt'))];
  var _PORT = 8883;
  var _HOST = 'mqtts://swarm-apim3.rtp.raleigh.ibm.com';

  var _client = mqtt.connect(_HOST, {
    port: _PORT,
    host: _HOST,
    key: _KEY,
    cert: _CERT,
    rejectUnauthorized : true,
    ca: _TRUSTED_CA_LIST,
    secureProtocol: 'TLSv1_method',
    protocolId: 'MQIsdp',
    protocolVersion: 3
  });

  _client.on('connect', function () {
    _client.subscribe('presence');
    _client.publish('presence', 'Hello mqtt');
  });

  _client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString());
    _client.end();
  });

  loopbackApplication.use(options.path, function (req, res, next) {
    res.send('Your Component');
    
  });
  
};
