// api/define.js
// Turn on/off debug messages
const debug = true;

function logDebug(message) {
  if (debug) {
    console.log(message);
  }
}

const getErrorMessage = (error) => {
  return `An error occurred while fetching the definition: ${error.message}. Try again later.`;
};

const NO_DEFINITION_MESSAGE = 'No definitions found for this word.';

// Function to format the response for Twitch chat
function formatResponse(definition) {
  const maxLength = 255; // Character limit for Twitch chat
  const term = definition.word; // The term
  let def = definition.meaning; // The definition

  // Remove brackets, parentheses, quotes, and replace line breaks with spaces
  def = def
    .replace(/\[|\]/g, "") // Remove square brackets
    .replace(/\n/g, " ") // Replace line breaks with spaces
    .replace(/\r/g, "") // Replace line breaks with spaces
    .trim(); // Remove leading/trailing spaces

  const shortDef =
    def.length > maxLength ? def.substring(0, maxLength - 3) + "..." : def; // Shorten if necessary

  return `${term}: ${shortDef}`;
}

export default async function handler(req, res) {
  const { term } = req.query;
  const limit = 3;
  logDebug({ "term": term });

  try {
    let url;
    if (["random", "randomword", "random word"].includes(term)) {
      url = `https://unofficialurbandictionaryapi.com/api/random`;
    } else {
      url = `https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(term)}&strict=false&matchCase=false&limit=${limit}&page=1&multiPage=false`;
    }

    logDebug(`Fetching from URL: ${url}`);
    const response = await fetch(url);
    logDebug(`Response status: ${response.status}`);
    const data = await response.json();
    logDebug(`Received data: ${JSON.stringify(data)}`);

    if (response.ok) {
      const definition = data.data[0];
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
