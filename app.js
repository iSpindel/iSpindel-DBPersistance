const mqtt = require('mqtt')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

const mqttClient = mqtt.connect('mqtt://minion:IPreferNotTo@192.168.1.120')
let dbClient;


MongoClient.connect('mongodb://localhost', (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    dbClient = client.db('iSpindel');
});

mqttClient.on('connect', () => { mqttClient.subscribe('ispindel/#') })
mqttClient.on('message', (topic, message) => {
    let topicSplit = topic.toString().split('/')

    let data = {}
    data[topicSplit[2]] = message.toString()
    dbClient.collection(topicSplit[1]).insert(data, (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log(result)
        }
    })
})