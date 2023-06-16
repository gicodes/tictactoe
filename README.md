
=======
## react-tictactoe

![alt-text](https://imgur.com/pnFGz02.jpg)

A simple browser-based tic-tac-toe game that depends on a locally-run nodejs server.

## Steps to run

`cd tictactoe` - From your terminal or command line, cd into tictactoe

`npm run first` - install npm script packages for both server and client

This will install all packages needed on both server and client side. After this process is finished, we can
run both the server and client instances with one single command:

`npm run dev` - npm script that runs both server and client instances

Now, the server will listen to the specified port (3001) and webpack will compile and host the client code,
listening on a specified port (3000). A browser window should open with the URL ‘http://localhost:3003’.
To run two clients at once, open a new tab with the same URL. The two tabs will now be playing against each
other.


>>>>>>> (added nodemon)
