const axios = require('axios');

exports.handler = async function (event, context) {
  const word = event.queryStringParameters.word;

  try {
    let response;

    if (word) {
      // Fetch the definition for the provided word
      response = await axios.get(`https://api.urbandictionary.com/v0/define`, {
        params: { term: word },
      });
    } else {
      // Fetch a random definition if no word is provided
      response = await axios.get('https://api.urbandictionary.com/v0/random');
    }

    if (response.data.list && response.data.list.length > 0) {
      const definitionData = response.data.list[0];
      return {
        statusCode: 200,
        body: JSON.stringify({
          word: definitionData.word,
          definition: definitionData.definition,
          example: definitionData.example,
        }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No definition found' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching definition' }),
    };
  }
};
