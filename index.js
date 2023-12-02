const fs = require('fs');
const process = require('process');
const request = require('request');

const apiUrl = 'https://icanhazdadjoke.com/search';

// Get the search term from the command line arguments
const searchTerm = process.argv[2];

// Check if the search term is provided
if (!searchTerm) {
  console.log('Please provide a search term.');
  process.exit(1);
}

// Configure the API request options
const Jokes = {
  url: `${apiUrl}?term=${encodeURIComponent(searchTerm)}`,
  headers: { 'Accept': 'application/json' }
};

// Make the API request
request(Jokes, (error, response, body) => {
  if (error) {
    console.error('Error making API request:', error);
    process.exit(1);
  }

  // Parse the API response
  const data = JSON.parse(body);

  // Check if jokes are found
  if (data.total_jokes > 0) {
    // Select a random joke
    const randomJoke = data.results[Math.floor(Math.random() * data.results.length)].joke;

    // Display the joke
    console.log('\nHere is a joke for you:');
    console.log(randomJoke);

    // Save the selected joke to jokes.txt
    fs.appendFile('jokes.txt', `${randomJoke}\n`, (err) => {
      if (err) {
        console.error('Error saving joke to file:', err);
      } else {
        console.log('Joke saved to jokes.txt for future laughs!');
      }
    });
  } else {
    // No jokes found
    console.log('\nOops! The joke gods are taking a day off. No jokes found for your search term.');
  }
});
