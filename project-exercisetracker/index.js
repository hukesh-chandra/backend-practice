const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Middleware to parse JSON and urlencoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



var users=[]
var exercises=[]

app.post('/api/users', (req, res) => {
  let username=req.body.username
  let id=(users.length+1).toString()
  let user={username,_id:id}
  users.push(user)
  res.json(user)
})

app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ username: u.username, _id: u._id })));
});

app.post('/api/users/:_id/exercises', (req, res) => {
  let id=req.params._id
  let user=users.find(u=>u._id===id)
  if(!user){
    res.json({error:"unknown _id"})
    return
  }
  let description=req.body.description
  let duration=parseInt(req.body.duration)
  let date=req.body.date
  if(!date){
    date=new Date().toDateString()
  }else{
    date=new Date(date).toDateString()
  }
  let exercise={description,duration,date}
  exercises.push({...exercise,_id:id})
  res.json({username:user.username,...exercise,_id:id})
})

app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const user = users.find(u => u._id === id);

  if (!user) {
    return res.json({ error: "unknown _id" });
  }

  let { from, to, limit } = req.query;
  let log = exercises.filter(e => e._id === id);

  if (from) {
    from = new Date(from);
    log = log.filter(e => new Date(e.date) >= from);
  }
  if (to) {
    to = new Date(to);
    log = log.filter(e => new Date(e.date) <= to);
  }
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    _id: id,
    username: user.username,
    count: log.length,
    log: log.map(e => ({
      description: e.description,
      duration: e.duration,
      date: e.date
    }))
  });
});

// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage
  if (err.errors) {
    errCode = 400 // Bad request
    const keys = Object.keys(err.errors)
    errMessage = err.errors[keys[0]].message
  } else {
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt').send(errMessage)
})

// Listen on port 3000


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
