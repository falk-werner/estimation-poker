# Estimation Poker

This repository contains a basic estimation poker implementation
based on websockets.

## Build Docker Image

```bash
docker buid -t estimation-poker .
```

## Run

```bash
docker run -it --rm -p 5000:5000 estimage-poker
```

Navigate to http://localhost:5000/.

### Environment Arguments

- HOST: IP address or hostname to bind to
- PORT: Port to bind to

### Command Line Arguments

- --host, -H STRING: IP address or hostname to bind to
- --port, -p NUMBER: Port to bind to

## Endpoints

- /  
  WebSite
- /estimate  
  WebSocket entpoint

## Query Parameters (WebSite)

- room  
  Defines the room to play.  
  `http://localhost:5000/?room=playroom`
- player  
  Name of the player.  
  `http://localhost:5000/?player=John`

## Local Storage Usage

Connection Parameters are stored in the browser's
local storage on connection.

## Protocol

### Messages from Website to WebSocket Server

#### Enter Room

```json
{
    "method": "enter",
    "params": {
        "room": "<NAME OF ROOM>",
        "player": "<NAME OF PLAYER>",
    }
}
```

#### Estimate

```json
{
    "method": "estimate",
    "params": {
        "estimate": "<ESTIMATED VALUE AS STRING>"
    }
}
```

#### Show Estimations

```json
{
    "method": "show"
}
```

#### Hide Estimations

```json
{
    "method": "show"
}
```

#### Clear Estimations

```json
{
    "method": "show"
}
```

### Messages from WebSocket Server to Website


```json
{
    "state": "hidden OR shown",
    "players": [{
        "name": "<NAME OF PLAYER>",
        "estimate" "<ESTIMATED VALUE OR - OR EMPTY STRING>"
    }]
}
```

## References

- https://websockets.readthedocs.io/en/stable/