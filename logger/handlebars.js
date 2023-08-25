const handlebars = require("handlebars");


handlebars.registerHelper('dryPeekEncode',function(inputData){
  return new handlebars.SafeString(inputData);
});
const helpers = require('handlebars-helpers')();


exports.handlebars = handlebars;
