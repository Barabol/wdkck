const express = require("express")
const cors = require("cors");
const path = require("path")

const app = express()

app.use(cors());
app.use(express.json());

app.post("/api/up", (req, res) => {
	console.log("OK (UP)")
})

app.post("/api/left", (req, res) => {
	console.log("OK (LEFT)")
})

app.post("/api/right", (req, res) => {
	console.log("OK (RIGHT)")
})

app.post("/api/stop", (req, res) => {
	console.log("OK (STOP)")
})

var battery = [100]
app.get("/api/battery", (req, res) => {
	res.send(JSON.stringify(battery))
	battery.push(battery[battery.length - 1] - 1)
})

app.get("/api/cam", (req, res) => {
	res.sendFile(__dirname + "/etc/img.png")
})

app.listen(8080, () => {
	console.log("ok")
})
