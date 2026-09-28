#!/usr/bin/env python3

import asyncio
import uuid
import json
import os
import argparse
import ssl
import sys
from websockets.asyncio.server import serve

class ConnectionManager:
    connections: dict

    def __init__(self):
        self.connections = {}

    def add(self, websocket) -> Connection:
        connection = Connection(self, websocket)
        self.connections[connection.id] = connection
        return connection

    async def remove(self, connection):
        self.connections.pop(connection.id)
        await self.update(connection.room)

    def get_room(self, room: str):
        state = "hidden"
        players = []
        for connection in self.connections.values():
            if room == connection.room and not connection.is_spectator:
                state = "hidden" if connection.hidden else "shown"
                players.append({
                    "name": connection.player,
                    "estimate": connection.get_estimate(),
                })
        return json.dumps({
            "state": state,
            "players": players,
        })

    async def update(self, room: str):
        state = self.get_room(room)
        for connection in self.connections.values():
            if room == connection.room:
                await connection.send(state)

    async def show(self, room: str):
        for connection in self.connections.values():
            if room == connection.room:
                connection.hidden = False
        await self.update(room)

    async def hide(self, room: str):
        for connection in self.connections.values():
            if room == connection.room:
                connection.hidden = True
        await self.update(room)

    async def clear(self, room: str):
        for connection in self.connections.values():
            if room == connection.room:
                connection.estimate = ""
                connection.hidden = True
        await self.update(room)


class Connection:
    connections: list
    websocket: None
    id: str
    room: str
    player: str
    is_spectator: bool
    estimate: str
    hidden: bool
    
    def __init__(self, connections, websocket):
        self.connections = connections
        self.websocket = websocket
        self.id = str(uuid.uuid4())
        self.room = "ROOM"
        self.player = "PLAYER"
        self.is_spectator = True
        self.estimate = ""
        self.hidden = True

    async def send(self, message: str):
        await self.websocket.send(message)

    def get_estimate(self):
        if self.hidden:
            return "" if self.estimate == "" else "-"
        return self.estimate

g_connections = ConnectionManager()        

def serve_http(connection, request):
    if request.path == "/" or request.path.startswith("/?"):
        with open("index.html", "r", encoding="utf-8") as f:
            content = f.read()
        response = connection.respond(200, content)
        del response.headers["Content-Type"]
        response.headers["Content-Type"] = "text/html"
        return response

async def poker(websocket):   
    connection = g_connections.add(websocket)

    async for message in websocket:
        try:
            data = json.loads(message)
            method = data.get("method", "")
            params = data.get("params",{})
            if method == "enter":
                connection.room = params.get("room", "ROOM")
                connection.player = params.get("player", "PLAYER")
                connection.is_spectator = params.get("is_spectator", True)

                await g_connections.update(connection.room)
            elif method == "estimate":
                connection.estimate = params.get("estimate", "?")
                await g_connections.update(connection.room)
            elif method == "show":
                await g_connections.show(connection.room)
            elif method == "hide":
                await g_connections.hide(connection.room)
            elif method == "clear":
                await g_connections.clear(connection.room)
            else:
                print(f"error: unknown method: {method}")
                
        except BaseException as ex:
            print(f"error: {ex}")
            pass

    await g_connections.remove(connection)
    

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", "-H", type=str, default=os.getenv("HOST", "0.0.0.0"))
    parser.add_argument("--port", "-p", type=int, default=int(os.getenv("PORT", "5000")))
    parser.add_argument("--cert", "-c", type=str, default=os.getenv("SSL_CERT", None))
    parser.add_argument("--key", "-k", type=str, default=os.getenv("SSL_KEY", None))
    args = parser.parse_args()

    context = None
    if args.cert is not None or args.key is not None:
        if args.cert is None:
            print("error: missing TLS certificate")
            sys.exit(1)
        if args.key is None:
            print("error: missing TLS key")
            sys.exit(1)
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(args.cert, args.key)


    server = await serve(poker, args.host, args.port, process_request=serve_http, ssl=context)
    protocol = "http" if context is None else "https"
    print(f"run websocket server at {protocol}://{args.host}:{args.port}/, use Ctrl-C to quit")
    await server.serve_forever()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
