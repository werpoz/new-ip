const io = require('socket.io-client');
const axios = require('axios');
const readline = require('readline');

let userEmail = '';

async function authenticateUser(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email,
      password,
    });
    userEmail = email; // Store the email after successful authentication
    return response.data.access_token;
  } catch (error) {
    console.log(error.code);
    console.error('Authentication failed:', error.message);
    process.exit(1);
  }
}

async function connectToChat(token) {
  const socket = io('http://localhost:3000', {
    auth: {
      token,
    },
  });

  socket.on('connect', () => {
    console.log('Connected to the server');

    // Listen for messages from the server
    socket.on('message', (data) => {
      console.log(`${data.user.email}: ${data.content}`); // Display email and message content
    });

    // Function to send a message
    const sendMessage = (messageContent) => {
      socket.emit('message', { content: messageContent, email: userEmail });
    };

    // Set up readline to allow sending messages from the console
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: `>` // Custom prompt
    });

    rl.prompt(); // Display the prompt initially

    rl.on('line', (input) => {
      sendMessage(input.trim()); // Trim input to avoid leading/trailing whitespace
      rl.prompt(); // Show the prompt again after sending the message
    });

    console.log('You can start sending messages...');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
}

function promptUserCredentials() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter your email: ', (email) => {
    rl.question('Enter your password: ', (password) => {
      rl.close();
      authenticateUser(email, password).then((token) => {
        connectToChat(token);
      });
    });
  });
}

promptUserCredentials();
