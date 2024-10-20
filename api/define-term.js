// api/define.js

export default async function handler(req, res) {
    const { word } = req.query; // Get the word from the query parameters
  
    // If no word is provided, fetch a random definition
    if (!word) {
      try {
        // Fetch a range of definitions (the Urban Dictionary API doesn't have a dedicated random endpoint)
        const response = await fetch(`https://api.urbandictionary.com/v0/random`);
        const data = await response.json();
  
        if (data.list && data.list.length > 0) {
          // Select a random definition from the fetched results
          const randomDefinition = data.list[Math.floor(Math.random() * data.list.length)];
          return res.status(200).json(randomDefinition);
        } else {
          // Return a not found message if no definitions are available
          return res.status(404).json({ error: "No definitions found." });
        }
      } catch (error) {
        // Handle any fetch errors
        return res.status(500).json({ error: "An error occurred while fetching the definition." });
      }
    }
  
    // If a word is provided, fetch its definition
    try {
      const response = await fetch(`https://api.urbandictionary.com/v0/define?term=${word}`);
      const data = await response.json();
  
      if (data.list && data.list.length > 0) {
        // Return the first definition if found
        return res.status(200).json(data.list[0]);
      } else {
        // Return a not found message if no definitions are available
        return res.status(404).json({ error: "Definition not found." });
      }
    } catch (error) {
      // Handle any fetch errors
      return res.status(500).json({ error: "An error occurred while fetching the definition." });
    }
  }
  