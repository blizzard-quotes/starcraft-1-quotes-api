'use strict';
const validator = require('validator');

/**
 * Validate and sanitize input.
 * @param {object} event
 * @returns {object} key value pair of parameters being passed in.
 */
const sanitize = (event) => {
  const multiValueQueryStringParams = 'multiValueQueryStringParameters';
  var params = {};
  if (
    multiValueQueryStringParams in event &&
    event[multiValueQueryStringParams]
  ) {
    params = event[multiValueQueryStringParams];

    let elements;
    for (const param in params) {
      elements = [];
      params[param].forEach((element) => {
        if (typeof element === 'string') {
          elements.push(validator.escape(element));
        } else if (typeof element === 'number') {
          elements.push(element);
        }
      });
      if (elements.length === 0) {
        delete params[param];
      } else {
        params[param] = elements;
      }
    }
  }
  return params;
};

module.exports = sanitize;
