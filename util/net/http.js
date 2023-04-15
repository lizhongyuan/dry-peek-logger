'use strict';


exports.getPath = function getPath(originalUrl) {

  let uri;

  const index = originalUrl.lastIndexOf('?');
  if (index >= 0) {
    uri = originalUrl.slice(0, originalUrl.lastIndexOf('?'));
  } else {
    uri = originalUrl;
  }

  return uri;
};
