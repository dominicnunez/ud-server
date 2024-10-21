// api/define.js
const debug = true; // Turn on/off debug messages
const limit = 1; // number of terms to return
const maxLength = 600; // Character limit for Twitch chat
const NO_DEFINITION_MESSAGE = 'No definitions found for this word.';

function logDebug(message) {
  if (debug) {
    console.log(message);
  }
}

const getErrorMessage = (error) => {
  return `An error occurred while fetching the definition: ${error.message}. Try again later.`;
};

// Function to format the response for Twitch chat
function formatResponse(definition) {
  
  const term = definition.word; // The term
  let def = definition.meaning; // The definition

  // Remove brackets, parentheses, quotes, and replace line breaks with spaces
  def = def
    .replace(/\[|\]/g, "") // Remove square brackets
    .replace(/\n/g, " ") // Replace line breaks with spaces
    .replace(/\r/g, "") // Replace line breaks with spaces
    .trim(); // Remove leading/trailing spaces

  const msgLength = (maxLength > 500) ? 500 : maxLength;
  const shortDef =
    def.length > msgLength ? def.substring(0, msgLength - 3) + "..." : def; // Shorten if necessary

  return `${term}: ${shortDef}`;
}

export default async function handler(req, res) {
  const { term } = req.query;
  logDebug({ "term": term });

  try {
    let url;
    if (["random", "randomword", "random word"].includes(term)) {
      url = `https://unofficialurbandictionaryapi.com/api/random?limit=${limit}&page=1&multiPage=false&`;
    } else {
      url = `https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(term)}&strict=false&matchCase=false&limit=${limit}&page=1&multiPage=false`;
    }

    logDebug(`Fetching from URL: ${url}`);
    const response = await fetch(url);
    logDebug(`Response status: ${response.status}`);
    const reponse = await response.json();
    logDebug(`Received reponse: ${JSON.stringify(reponse)}`);

    if (response.ok) {
      const definition = reponse.data[0];
      logDebug({ "fetched definition": definition });
      const formattedResponse = formatResponse(definition);
      return res.status(200).json(formattedResponse);
    } else if (response.status === 404) {
      logDebug({"status check": response.status === 404})
      return res.status(200).send(NO_DEFINITION_MESSAGE);
    }
  } catch (error) {
    logDebug(`Error occurred: ${error}`);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: getErrorMessage(error) });
  }
}
