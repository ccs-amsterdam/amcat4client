# Amcat 4 Client

React front-end for communicating with an AmCAT4 server.

# Installation

## Development

```
git clone git@github.com:ccs-amsterdam/amcat4client
cd amcat4client
npm install
npm start
```

## Build

Clone as above, then run:

```
npm run build
```

## Attaching to a specific host

To attach this client to a specific host, use:

```
REACT_APP_FIXED_HOST=https://host.example.com/path npm start
REACT_APP_FIXED_HOST=https://host.example.com/path npm run build
```
