'use strict';

/**
 * Returns a subset of quotes based on the query string parameters passed
 * through the event parameter.
 * @param {object} params - object containing parameters being passed in.
 * query string parameters.
 * @param {array} quotes - list of quotes.
 * @returns {array} an array of quotes filtered based on the query.
 */
const parseQueryString = (params, quotes) => {
  const queryParams = params;

  let queriedQuotes;
  for (const queryParam in queryParams) {
    if (
      queryParam === 'faction' ||
      queryParam === 'unit' ||
      queryParam === 'action'
    ) {
      queriedQuotes = [];
      queryParams[queryParam].forEach(param => {
        queriedQuotes = queriedQuotes.concat(
          quotes.filter(
            elem =>
              elem[queryParam] ===
              param.charAt(0).toUpperCase() + param.slice(1).toLowerCase()
          )
        );
      });
      quotes = queriedQuotes;
    } else if (queryParam === 'text') {
      queriedQuotes = [];
      queryParams[queryParam].forEach(param => {
        queriedQuotes = queriedQuotes.concat(
          quotes.filter(elem => elem['value'].includes(param))
        );
      });
      quotes = queriedQuotes;
    } else if (queryParam === 'is_hero') {
      queriedQuotes = [];
      queryParams[queryParam].forEach(param => {
        queriedQuotes = queriedQuotes.concat(
          quotes.filter(
            elem => elem['isHero'].toString() == param.toLowerCase()
          )
        );
      });
      quotes = queriedQuotes;
    } else if (queryParam === 'is_melee') {
      queriedQuotes = [];
      queryParams[queryParam].forEach(param => {
        queriedQuotes = queriedQuotes.concat(
          quotes.filter(
            elem => elem['isMelee'].toString() == param.toLowerCase()
          )
        );
      });
      quotes = queriedQuotes;
    }
  }

  for (const queryParam in queryParams) {
    if (
      queryParam === 'not_faction' ||
      queryParam === 'not_unit' ||
      queryParam === 'not_action'
    ) {
      queryParams[queryParam].forEach(param => {
        quotes = quotes.filter(
          elem =>
            !(
              elem[queryParam.split('_')[1]] ===
              param.charAt(0).toUpperCase() + param.slice(1)
            )
        );
      });
    } else if (queryParam === 'not_text') {
      queryParams[queryParam].forEach(param => {
        quotes = quotes.filter(elem => !elem['value'].includes(param));
      });
    }
  }

  if ('offset' in queryParams) {
    quotes.splice(0, queryParams['offset']);
  }

  if ('limit' in queryParams) {
    quotes = quotes.splice(0, queryParams['limit']);
  }

  return quotes;
};

module.exports = parseQueryString;
