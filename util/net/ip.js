'use strict';


const ip = require('ip');


exports.getLocalIp = function getLocalIp() {
  return ip.address();
};
