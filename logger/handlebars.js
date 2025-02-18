const handlebars = require("handlebars");


handlebars.registerHelper('dryPeekEncode',function(inputData){
  return new handlebars.SafeString(inputData);
});
const helpers = require('@budibase/handlebars-helpers')();


exports.handlebars = handlebars;
