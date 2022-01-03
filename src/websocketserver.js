import WebSocket from "ws";

export default class WebSocketServer {
    constructor(server) {
        this._server = new WebSocket.Server({
            noServer: true,
            path: "/ws"
        });

        server.on("upgrade", (request, socket, head) => this.onUpgrade(request, socket, head));

        this._server.on("connection", (connection, request) => this.onConnection(connection, request));
    }

    onUpgrade(request, socket, head) {
        console.log("upgrade");
        this._server.handleUpgrade(request, socket, head, websocket => {
            this._server.emit("connection", websocket, request);
        });
    }

    onConnection(connection, request) {
        console.log("connection");
        connection.on("message", message => this.onMessage(message));
        connection.on("close", o => this.onClose(o));
        connection.on("error", o => this.onError(o));
        connection.on("open", o => this.onOpen(o));
    }

    onMessage(message) {
        console.log("message", message);
        try {
            const json = JSON.parse(message.toString());
            console.log(json);
        } catch(e) {
            console.log(message.toString());
        }
    }

    onClose(o) {
        console.log("close", o);
    }

    onError(o) {
        console.log("error", o);
    }

    onOpen(o) {
        console.log("open", o);
    }
}