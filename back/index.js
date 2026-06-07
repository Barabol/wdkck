const express = require("express")
const cors = require("cors");
const path = require("path");
const { randomInt } = require("crypto");

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
	battery.push(battery[battery.length - 1] - randomInt(2))
})

var cpu = [100]
app.get("/api/cpu", (req, res) => {
	res.send(JSON.stringify(battery))
	battery.push(randomInt(101))
})

app.get("/api/cam", (req, res) => {
	res.sendFile(__dirname + "/etc/img2.png")
})

app.get("/api/stat", (req, res) => {
	res.send({
		temp: randomInt(101),
		cpu: randomInt(101),
		mem: randomInt(101),
		warning: randomInt(2) == 1,
		uptime: randomInt(365) + 1 + " days"

	})
})
app.post("/api/move", (req, res) => {
	console.log(req.body)
	res.sendStatus(200)
})

app.get("/test", (req, res) => {
	res.sendFile("/Users/user/github/SkipiNavigator/app/src/main/resources/application.properties")
})

app.listen(8080, () => {
	console.log("ok")
})
