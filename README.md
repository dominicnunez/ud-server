# Urban Dictionary API for Twitch chat bots

This is an API server that interfaces with the Unofficial Urban Dictionary API to fetch and format Urban Dictionary definitions. It is designed for use with Twitch chat commands, providing random or specific definitions based on user input.

## Features

- **Random Word Definitions**: Triggered when certain keywords (e.g., `random`, `rand`) are used.
- **Search for Definitions**: Allows users to search for a specific term's definition.
- **Formatted Responses**: Returns a cleaned-up, Twitch-friendly response to fit within the character limits for chat.
- **Error Handling**: Returns a user-friendly error message if something goes wrong during the API call.

## Project Structure

- `api/define.js`: Main API route responsible for fetching, processing, and returning Urban Dictionary definitions.
- **Environment Variables**: Debug mode and other configurations are customizable.

## How It Works

### 1. Fetching Definitions
The API accepts user input via query parameters (`term`). Based on the term provided:
- If a **random term** is requested, the app fetches a random word definition.
- If a **specific term** is provided, it will search for that term on the Urban Dictionary.

### 2. Formatting Definitions
The app will return a successfull query as `Term: Definition` that does not exceed `MAX_LENGTH` with:
- Removing extra symbols such as square brackets (`[]`).
- Removing return lines (`\r`).
- Replacing newlines (`\n`) with spaces.
- Replacing double quotes (`"`) with single quotes (`'`) to avoid issues with Twitch chat escape characters.
- Replacing last 3 characters in definition with ellipsis (`...`) when the formatted response exceeds `MAX_LENGTH` configuration.

### Error Handling
- If no definitions are found or an error occurs, the following message will be returned:
```No definitions found for this word.```
- Or in case of an API error:
```An error occurred while fetching the definition: {error_message}. Try again later.```

## Configuration
Check `define.js` for additional detailed comments on these configuration options if you wish to make changes.

- **DEBUG**: Set to "true" or "false" to control logging on or off.
    - Default: true
- **LIMIT**: Defines the number of results to return.
    - Default: 1
- **MAX_LENGTH**: Limits the character count of the returned response.
    - Default: 395
- **NO_DEFINITION_MESSAGE**: Custom message shown when no definition is found.
    - Default: No definitions found for this query.
- **RANDOM_TRIGGERS**: Words or phrases that will trigger a random lookup.
    - Default: ["random", "randomword", "random+word", "rand", "randomize"]

## Deployment
1. Create a [GitHub](https://www.github.com) account if you don't have one.
2. Fork the repository.
3. Login into [Vercel](https://vercel.com/login) with your GitHub account.
4. Add new project.
5. Import the repository and deploy.

**Note**: This API may be setup on other platforms such as Render or Netlify, but some changes may be necessary.

## Usage

### Streamelements Chatbot
1. Create a new custom command
2. Set command name
3. Set the response type to:
```bash
$(customapi yourURL/api/define?term=$(queryescape ${1:}))
```
 #### **NOTE: Replace `yourURL` with the actual URL of the deployed app.**
4. Save command

### Web App
- You can also test the API using the included HTML file.
- This file provides a basic interface to fetch definitions from the API by entering a term or fetching a random definition.
- Once the app is deployed, navigate to the URL provided.
- This webpage is provided as an example and for testing purposes.

### API Endpoints

#### Random Definition
`/api/define?term=random` \
This will return a random word definition.

#### Search for a Term
`/api/define?term=query` \
This will return the first definition for the specified term.

## Example Responses
- **Non-max character limit**: "Dokes: Short for 'okey dokey' - meaning 'OK'."
- **Max character limit**: "Denny's: Denny's is a 24-hour diner. They serve warm mediocre quality food, coffee, and the essential Meat-Lover's Skillet. To fully qualify as a Denny's however the diner must have: 1.) A waitress that has worked there way too long. She is missing a finger, a tooth, or maybe she has a 6th toe. In any case she's freaking tired and does not take any of your crap. 2.) One of the following ..."

## Debugging
Console Logs include:
- Raw definition
- Formatted response and length
- Queried term
- URL fetch
- Reponse status
- Received response
- 404 condition check
- Errors that are not 404

## Contributing
Feel free to submit issues or pull requests if you find any bugs or want to add features.