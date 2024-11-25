const express = require('express') // for some reason, can't use import
const cors = require('cors') // needed to deal with CORS
// File Storage
import { upload } from './storageEngine'

const app = express()
const PORT = 8080

app.use(cors()) //to use cors requests
app.use(express.json()) // to use json formating

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.post('/save', upload.single('file'), (req, res) => {
    res.send("PASSED")
})

app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`)
})