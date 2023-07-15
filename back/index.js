const mysql = require('mysql2');
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');

// db
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    database: 'akulla',
    password: ''
});

app.use(cors());

const stats = {
    "nb_players": true,
    "money": true,
    "players": true,
    "temps_connexionjoueur": true,
    "weapons": true,
}

app.get('/getlogs', (req, res) => {
    connection.query('SELECT * FROM flux_webloghistory ORDER BY date DESC LIMIT 10', function(err, results, fields){
        connection.query('SELECT * FROM flux_webloghistory_playerlog, flux_character WHERE flux_webloghistory_playerlog.userid = flux_character.userid', function(err, results2, fields){
            let data = {}

            results.forEach(d => {
                d.log_id = parseInt(d.log_id)
                d.textdata = JSON.parse(d.textdata)
                data[parseInt(d.log_action_id)] = d
            })

            results2.forEach(d => {
                data[parseInt(d.log_action_id)].textdata[parseInt(d.param_id)-1] = {
                    data: parseInt(d.userid),
                    name: d.name,
                }
            })

            res.status(200).send(data)
        })
    })
})

app.get('/getstats', (req, res) => {
    const s = req.query.statname
    let time = parseInt(req.query.time)

    if(!time){time = 0}

    // Switch to real time
    switch (time){
        case 0:
            time = 300
            break
        case 1:
            time = 3600
            break
        case 2:
            time = 3600*24
            break
        default:
            time = 300
    }

    if (!s || !stats[s]){
        res.status(422)
        return
    }

    connection.query('SELECT * FROM fluxstats_' + s + ' GROUP BY FLOOR(TIME DIV ' + time + ') ORDER BY time DESC LIMIT 10', function(err, results, fields){
        let t = []

        results.forEach(singleData => {
            t.push(singleData['time'])
            singleData['time'] = undefined
        })

        res.status(200).send([t, results]);
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
