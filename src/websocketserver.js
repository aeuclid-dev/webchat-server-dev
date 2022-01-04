import WebSocket from "ws";

export default class WebSocketServer {
    constructor(server) {
        this._server = new WebSocket.Server({
            noServer: true,
            path: "/ws"
        });

        this._map = new Map();

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
        connection.on("message", message => this.onMessage(connection, message));
        connection.on("close", o => this.onClose(connection, o));
        connection.on("error", o => this.onError(connection, o));
        connection.on("open", o => this.onOpen(connection, o));
    }

    onMessage(connection, message) {
        console.log("message", message);
        try {
            const json = JSON.parse(message.toString());
            console.log(json);

            if(json.type === 'login') {
                if(json.user) {
                    this._map.set(json.user, connection);
                }
            } else if(json.type === 'invite') {
                if(json.to) {
                    const to = this._map.get(json.to);
                    if(to){
                        to.send(message.toString());
                        console.log("send invite");
                    }
                } else {
                    connection.send(JSON.stringify({type: "error", message: "invite fail"}));
                }
            } else if(json.type === 'invited') {
                if(json.from) {
                    const from = this._map.get(json.from);
                    if(from) {
                        from.send(message.toString());
                        console.log("send invited");
                    }
                }
            } else if(json.type === "offer") {
                if(json.to) {
                    const to = this._map.get(json.to);
                    if(to) {
                        to.send(message.toString());
                        console.log("send offer");
                    } else {
                        console.log("to is null");
                    }
                } else {
                    console.log("json.to is null");
                }
            } else if(json.type === "answer") {
                if(json.to) {
                    const to = this._map.get(json.to);
                    if(to) {
                        to.send(message.toString());
                        console.log("send answer");
                    } else {
                        console.log("to is null");
                    }
                } else {
                    console.log("json.to is null");
                }
            } else if(json.type === "candidate") {
                if(json.to) {
                    const to = this._map.get(json.to);
                    if(to) {
                        to.send(message.toString());
                        console.log("send candidate");
                    } else {
                        console.log("to is null");
                    }
                } else {
                    console.log("json.to is null");
                }
            }

        } catch(e) {
            console.log(message.toString());
        }
    }

    onClose(connection, o) {
        console.log("close", o);
    }

    onError(connection, o) {
        console.log("error", o);
    }

    onOpen(connection, o) {
        console.log("open", o);
    }

    broadcast(message) {
        console.log("broadcast");
        this._map.forEach(o => {
            console.log(message);
            o.send(message);
        });
    }
}