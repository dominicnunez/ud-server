# Urban Dictionary API Bot for Twitch

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
The app formats the definitions for easier readability and compliance with Twitch's chat character limits. This includes:
- Removing extra symbols such as square brackets (`[]`).
- Replacing newlines (`\n`) with spaces.
- Replacing double quotes (`"`) with single quotes (`'`) to avoid issues with Twitch chat escape characters.
- Replacing last 3 characters in definition with ellipsis (`...`) when the definition exceeds `MAX_LENGTH` configuration.

### 3. Error Handling
If the definition cannot be fetched or the API request fails, an appropriate error message will be returned.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/urban-dictionary-api.git
2. **Install Dependencies**: Ensure you have Node.js installed, then run:
    ```bash
    npm install
3. **Deploy to Vercel**: You can easily deploy this API to Vercel:
    ```bash
    vercel
4. **Environment Variables**: You may set custom environment variables in a .env file to configure the debug mode or API limits.

## Configuration

- **`DEBUG`**: Set to `true` or `false` to control the level of logging. By default, it's set to `true`.
- **`LIMIT`**: Defines the number of results to return (defaults to 1).
- **`MAX_LENGTH`**: Limits the character count of the returned response.
- **`NO_DEFINITION_MESSAGE`**: Custom message shown when no definition is found.

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
- You can also test the API locally using the included HTML file.
- This file provides a simple interface to fetch definitions from the API by entering a term or fetching a random definition.
- Once the app is deployed, navigate to the URL provided.
- This webpage is provided as an example and for testing purposes.

### API Endpoints

- **Random Definition**
/api/define?term=random
This will return a random word definition.

- **Search for a Term**
/api/define?term=exampleTerm
This will return the first definition for the specified term.

### Example Response
- **Non-max character limit**: "Dokes: Short for 'okey dokey' - meaning 'OK'."
- **Max character limit**: "Denny's: Denny's is a 24-hour diner. They serve warm mediocre quality food, coffee, and the essential Meat-Lover's Skillet. To fully qualify as a Denny's however the diner must have: 1.) A waitress that has worked there way too long. She is missing a finger, a tooth, or maybe she has a 6th toe. In any case she's freaking tired and does not take any of your crap. 2.) One of the following ..."

### Error Handling
If no definitions are found or an error occurs, the following message will be returned:
No definitions found for this word.
Or in case of an API error:
An error occurred while fetching the definition: {error_message}. Try again later.

## Debugging
Logs include:
- API request and response details.
- Definition formatting steps.
- Error messages (if applicable).

## Contributing
Feel free to submit issues or pull requests if you find any bugs or want to add features.