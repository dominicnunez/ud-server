// api/define.js
const DEBUG = true; // Turn on/off debug messages
const LIMIT = 1;
/* number of terms to return
* Currently this should not be changed from 1, as the bot will only display the top result.
* Increasing the limit will only increase the data response
* However, in the future, this could be used with a new feature that returns 2nd, 3rd, etc result */
const MAX_LENGTH = 395; 
/** Character limit for the formatted response. While twitch's max chat character limit is 500, 
 * streamelements chatbot can only handle 397 when using customapi command.
 * Exceeding a bots character limitations may produce incorrectly formatted messages when MAX_LENGTH exceeds that limit. **/
const NO_DEFINITION_MESSAGE = 'No definitions found for this query.'; // Message when no definition is found
const RANDOM_TRIGGERS = ["random", "randomword", "random+word", "rand", "randomize"]
/* list of words that will trigger a random word/phrase to be returned. 
* In phrases with spaces, the spaces should be replaced with the plus symbol (+). Example: "random+word" */

function logDebug(message) {
  if (DEBUG) {
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
  logDebug({"def": def})

  // Remove brackets, parentheses, quotes, and replace line breaks with spaces
  def = def
    .replace(/\[|\]/g, "") // Remove square brackets
    .replace(/\n/g, " ") // Replace line breaks with spaces
    .replace(/\r/g, "") // Remove returns with spaces
    .replace(/"/g, "'")


    .trim(); // Remove leading/trailing spaces

  const formatDef =
    term.length + def.length + 4 > MAX_LENGTH ? def.substring(0, MAX_LENGTH - 4 - term.length) + "..." : def; // Shorten if necessary
  const termDefinition = `${term}: ${formatDef}`;
  logDebug({"termDefinition length": termDefinition.length, "termDefinition": termDefinition})
  return termDefinition;
}

export default async function handler(req, res) {
  const { term } = req.query;
  logDebug({ "term": term });

  try {
    let url;
    if (RANDOM_TRIGGERS.includes(term)) {
      url = `https://unofficialurbandictionaryapi.com/api/random?limit=${LIMIT}&page=1&multiPage=false&`;
    } else {
      url = `https://unofficialurbandictionaryapi.com/api/search?term=${encodeURIComponent(term)}&strict=false&matchCase=false&limit=${LIMIT}&page=1&multiPage=false`;
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
    return res.status(200).json({ error: getErrorMessage(error) });
  }
}
