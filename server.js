const express = require("express")
require("dotenv").config()
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()
const port = process.env.PORT || 3030

////////////////
// MIDDLEWARE //
////////////////

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
	console.log("MIDDLEWARE LOG", {
		origin: req.hostname,
		path: req.url,
	})
	next()
})

mongoose.connect(process.env.MONGO_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
})

mongoose.connection.once("connected", () => console.log("Connected to Mongo, life is good."))

////////////
// ROUTES //
////////////

app.use("/", require("./controllers/rootController"))
app.use("/user", require("./controllers/userController"))
app.use("/admin", require("./controllers/adminController"))
app.use("/pwr", require("./controllers/pwrController"))

//////////////
// LISTENER //
//////////////

app.listen(port)
