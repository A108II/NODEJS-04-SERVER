# README

## Overview
This README provides an overview of a Node.js application that serves static files, handles different file types, and implements event logging and error handling. The application uses the built-in `http` module to create a server and the `fs` and `fsPromises` modules for file system operations. It also utilizes the `events` module to create and manage custom events.

## Dependencies
The application does not have any external dependencies. It uses the following built-in Node.js modules:

- `path`: For handling and transforming file paths.
- `fs`: For synchronous file system operations.
- `fsPromises`: For asynchronous file system operations using promises.
- `http`: For creating an HTTP server.
- `events`: For creating and managing custom events.

## Installation
Beside `date-fns` & `uuid` package no installation is required for this application.

## Usage

### Running the Application
1. Navigate to the project directory in your terminal.
2. Run the following command to start the server:
   ```bash
   npm run dev
   ```
   The server will start listening on the specified port (default is 3500).

### Serving Static Files
The application serves static files based on the requested URL and file extension. It supports the following file types:

- HTML (`.html`)
- JSON (`.json`)
- JavaScript (`.js`)
- CSS (`.css`)
- JPEG images (`.jpg`)
- PNG images (`.png`)
- Plain text (`.txt`)

If a file is not found, the application will serve a custom 404 page.

### Event Logging
The application logs events using a custom event emitter. Whenever a request is made, the URL and HTTP method are logged to a file named `logEvents.txt`. Additionally, any errors that occur during file serving are logged to a file named `logError.txt`.

### Error Handling
If an error occurs while reading a file, the application logs the error using the custom event emitter and sends a 500 Internal Server Error response to the client.

### Redirects
The application implements the following redirects:

- `image.html` is redirected to `image_page.html` with a 301 status code.
- `www.index.html` is redirected to `index.html` with a 301 status code.

## Conclusion
This README provides an overview of a Node.js application that serves static files, handles different file types, and implements event logging and error handling. It covers the dependencies, installation, usage instructions, and the core functionality of the application.

