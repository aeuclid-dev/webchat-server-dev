import express from 'express';
import WebSocketServer from './websocketserver';
import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'novemberizing',
    password: 'melong@17',
    database: 'WEBCHAT',
    connectionLimit: 32
});

const application = express();

application.use('/files', express.static('public'));

application.get("/", (req, res) => {
    res.send("hello world");
});

application.get("/v1/user/logout/:id", (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) {
            res.status(500).end();
            return;
        }
        // console.log(req.params.id);
        const sql = `UPDATE TB_USER SET \`login\`=NULL WHERE \`identity\`=? AND \`login\` IS NOT NULL`;
        const params = [req.params.id];

        connection.query(sql, params, (error, result) => {
            if(error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            // console.log(result);
            if(result.changedRows === 1) {
                res.send("ok");
            } else {
                res.status(500).end();
            }
        });
        connection.release();
    });
});

application.get("/v1/user/login/:id", (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) {
            res.status(500).end();
            return;
        }
        // console.log(req.params.id);
        const sql = `UPDATE TB_USER SET \`login\`=CURRENT_TIMESTAMP() WHERE \`identity\`=? AND \`login\` IS NULL`;
        const params = [req.params.id];

        connection.query(sql, params, (error, result) => {
            if(error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            // console.log(result);
            if(result.changedRows === 1) {
                websocketServer.broadcast(JSON.stringify({type: 'refresh'}));
                res.send("ok");
            } else {
                res.status(500).end();
            }
        });
        connection.release();
    });
    // res.send({result: "ok"});
});

application.get("/v1/user/summary/:id", (req, res) => {
    pool.getConnection((error, connection) => {
        if(error) {
            res.status(500).end();
            return;
        }

        const sql = `(SELECT * FROM TB_HISTORY WHERE \`type\`=0 AND \`userid\`=? ORDER BY \`id\` DESC LIMIT 0, 1)
                     UNION
                     (SELECT * FROM TB_HISTORY WHERE \`type\`=1 AND \`userid\`=? ORDER BY \`id\` DESC LIMIT 0, 1)`
        const params = [req.params.id, req.params.id];

        connection.query(sql, params, (error, result) => {
            if(error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.send(result);
        });
        connection.release();
    });
});

application.get("/v1/user/list", (req, res) => {
    // offset, limit
    if(!req.query.offset) {
        req.query.offset = 0;
    } else {
        try {
            req.query.offset = parseInt(req.query.offset);
        } catch(e) {
            req.query.offset = 0;
        }
    }
    if(!req.query.limit) {
        req.query.limit = 3;
    } else {
        try {
            req.query.limit = parseInt(req.query.limit);
        } catch(e) {
            req.query.limit = 3;
        }
    }
    if(req.query.limit > 3) {
        req.query.limit = 3;
    }
    
    pool.getConnection((error, connection) => {
        if(error) {
            res.status(500).end();
            return;
        }
        const sql = `SELECT
    U.id AS idx,
    U.identity AS userid,
    U.name AS username,
    U.profile AS \`profile\`,
    P.value AS picture,
    C.value AS \`text\`
FROM TB_USER U
LEFT JOIN TB_HISTORY P
ON (U.id = P.userid AND P.type = 1)
LEFT JOIN TB_HISTORY C 
ON (C.type = 0 AND U.id = C.userid)
WHERE U.login IS NOT NULL
ORDER BY U.login ASC`
        const params = [req.query.offset, req.query.limit];

        connection.query(sql, params, (error, result) => {
            if(error) {
                console.log(error);
                res.status(500).end();
                return;
            }
            res.send(result);
        });
        connection.release();
    });
});

const server = application.listen(8080, () => {
    console.log("application server is running!");
});

const websocketServer = new WebSocketServer(server);
