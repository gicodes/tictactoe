## react-tictactoe

![alt-text](https://imgur.com/pnFGz02.jpg)

A simple browser-based tic-tac-toe game that depends on a locally-run nodejs server.

## Steps to run

`cd tictactoe` - From your terminal or command line, cd into tictactoe directory, often referred to as the root or base directory.

`cd socket-client` - From your terminal or command line, cd into the client directory to view and run NEXT.js app which serves the front-end or client-side's public views, HTML and stylesheets.

`cd socket-server` - Create a new window on your terminal or command line, cd into the TicTacToes server directory to view or run Node.js which serves and maintains this app back-end servers and server-side logic.

`npm init` - Run this command on both windows (client and server) to install npm dependencies and packages.

`npm run dev` - initiate the npm script that runs both the server and client instances.


### `npm run first` - install npm script packages for both server and client. This will install all packages needed on both server and client side. After this process is finished, we can run both the server and client instances with one single command: 

`npm run dev` - npm script that runs both instances.
### However, it is not available on this project at the moment.


Now, the server will listen to the specified port (3003) and webpack will compile and host the client code,
listening on a specified port (3000). A browser window should open with the URL ‘http://localhost:3003’.

To run two clients at once, open a new tab with the same URL. The two tabs will now be playing against each
other.
=======
### recommended:

Following a Client-server Architectural pattern, it is recommended to run different instances across the client and server apps.

`cd socket-client` - From your terminal or command line, cd into the 'socket-client' directory to view and run the client (Next app).

`cd socket-server` - Create a new window on your terminal or command line. Cd into the 'socket-server' directory to view or run the server.

`npm init` - run this command on both windows (client and server) to install npm dependencies and packages.

`npm run dev` - run this command on both windows (server first, client second) to initiate or start both app instances.

### not recommended:

Assume an MVC Architectural pattern where Model-View-Controller are in the root directory-- run both client and server apps with a single instance. 

`npm run first` - From your terminal or command line, install npm script packages for both server and client. 
This will install all packages needed on both server and client side. After this process is finished, we can run both the server and client instances with one single command: 

`npm run dev` - npm script that runs app instances.

________________________

Now, the server will listen to the specified port (3003) and webpack will compile and host the client code, listening on a specified port (3000). A browser window should open with the URL ‘http://localhost:3003’.

To run two clients at once, open a new tab with the same URL. The two tabs will now be playing against each other.
