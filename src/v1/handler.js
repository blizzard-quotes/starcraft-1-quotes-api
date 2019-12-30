/**
 * Handler for handling serverless Starcraft quotes lambda functions.
 */
'use strict';
const validator = require('validator');
const starcraft1Quotes = require('@blizzard-quotes/starcraft-1-quotes');
const sanitize = require('../utils/sanitize');
const parseQueryString = require('../utils/parse-query-string');

const MESSAGE_INTERNAL_SERVER_ERROR = 'Internal server error';

/**
 * Returns a response including statusCode, headers, and body.
 * @param {number} statusCode
 * @param {object} body
 */
const response = (statusCode, body) => ({
  statusCode: statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: body
});

/**
 * Returns all unique values pertaining to a specific key (e.g. unit) in a quotes object.
 * @param {number} key - The key attribute in a quotes object.
 * @param {number} event - The event object contains paramaters.
 * @returns {array} an array of unique values pertaining to a specific key.
 */
const uniqueKeyValues = (key, event = {}) => {
  let params = sanitize(event);
  let offset;
  let limit;

  try {
    let quotes = [...starcraft1Quotes];

    if (Object.keys(params).length !== 0) {
      for (const param in params) {
        if (param === 'offset') {
          offset = params[param];
          delete params[param];
        } else if (param === 'limit') {
          limit = params[param];
          delete params[param];
        } else if (
          param !== 'faction' &&
          param !== 'not_faction' &&
          param !== 'is_hero' &&
          param !== 'is_melee'
        ) {
          delete params[param];
        }
      }
      quotes = parseQueryString(params, quotes);
    }

    let uniqueKeyValues = [...new Set(quotes.map(element => element[key]))];

    if (offset) {
      uniqueKeyValues.splice(0, offset);
    }

    if (limit) {
      uniqueKeyValues = uniqueKeyValues.splice(0, limit);
    }

    return response(200, JSON.stringify(uniqueKeyValues));
  } catch (error) {
    console.error(error);
    return response(
      500,
      JSON.stringify({ message: MESSAGE_INTERNAL_SERVER_ERROR })
    );
  }
};

/**
 * Returns quotes.  Accepts query parameters.
 */
module.exports.quotes = async event => {
  let params = sanitize(event);

  try {
    let quotes = [...starcraft1Quotes];

    if (Object.keys(params).length !== 0) {
      quotes = parseQueryString(params, quotes);
    }

    return response(200, JSON.stringify(quotes));
  } catch (error) {
    console.error(error);
    return response(
      500,
      JSON.stringify({ message: MESSAGE_INTERNAL_SERVER_ERROR })
    );
  }
};

/**
 * Returns a random quote.  Accepts query parameters.
 */
module.exports.quotesRandom = async event => {
  let params = sanitize(event);

  try {
    let quotes = [...starcraft1Quotes];

    if (Object.keys(params).length !== 0) {
      quotes = parseQueryString(params, quotes);
    }

    let quote = quotes[Math.floor(Math.random() * Math.floor(quotes.length))];

    return response(200, JSON.stringify(quote));
  } catch (error) {
    console.error(error);
    return response(
      500,
      JSON.stringify({ message: MESSAGE_INTERNAL_SERVER_ERROR })
    );
  }
};

/**
 * Returns a specific quote.  Accepts one parameter which is the id
 * of the quote to return.
 */
module.exports.quotesId = async event => {
  const id = validator.escape(event['pathParameters']['id']);

  try {
    let quote = starcraft1Quotes.find(quote => {
      return quote['id'] == id;
    });

    if (!quote) {
      return response(
        400,
        JSON.stringify({
          message: `Invalid request. Quote with id ${id} was not found.`
        })
      );
    }

    return response(200, JSON.stringify(quote));
  } catch (error) {
    console.error(error);
    return response(
      500,
      JSON.stringify({ message: MESSAGE_INTERNAL_SERVER_ERROR })
    );
  }
};

/**
 * Returns all factions
 */
module.exports.factions = async () => {
  return uniqueKeyValues('faction');
};

/**
 * Returns units
 */
module.exports.units = async event => {
  return uniqueKeyValues('unit', event);
};

/**
 * Returns all actions
 */
module.exports.actions = async () => {
  return uniqueKeyValues('action');
};
