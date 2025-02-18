'use strict';


const moment = require('moment');


exports.getISODate = function getISODate(ts) {
  return moment(ts).toISOString();
};
