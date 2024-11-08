const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://Test1:test1234@cluster0.1zhxkth.mongodb.net/TodoProject?retryWrites=true&w=majority"

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch(err => console.log(err));

const Todo = require('./models/Todo')

app.get('/todos', async(req, res)=>{
    const todos = await Todo.find()
    res.json(todos);
})


app.post('/todo/new', (req, res)=>{
    const todo = new Todo({
        text: req.body.text
    })
    todo.save()

    res.json(todo)
})

app.delete('/todo/delete/:id', async(req, res)=>{
    const result = await Todo.findByIdAndDelete(req.params.id)

    res.json(result)
})


app.get('/todo/complete/:id', async(req, res)=>{
    const todo = await Todo.findById(req.params.id)

    todo.complete = !todo?.complete

    todo.save()

    res.json(todo)
})

// listen to 3001 port
app.listen(3001,()=> console.log('Server started on port 3001'))