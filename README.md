# Block Falling Online 2

## How to Install

### Install NodeJS and NPM

Block Falling Online 2 is build around NodeJS, to run the server you need NodeJS installed

### Install Dependencies

To install the dependencies, use this command on the project directory

    npm install

### Install Forever (optional)
Forever is a daemon manager for NodeJS applications
To install forever, run this command

    npm install forever -g

### Configure your server

Copy config.json.dist to config.json and configure it

### Launch the server

#### Without Forever
Start the server

    node path/to/server.js
Stop the server

    Ctrl + C

#### With Forever
Start the server

    forever start path/to/server.js
Stop the server

    forever stop path/to/server.js

#### Profit
Your server will appear in [this list](http://blockfallingonline.eu) if running