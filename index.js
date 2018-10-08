const express  = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('./database/conn');
const config = require('./config')
const Post = require('./models/Post')

const PORT = process.env.PORT
// if(process.env.NODE_ENV !== 'production'){
//     require('dotenv').config()
// }

app.use(cors())
//body-parser middleware
app.use(bodyParser.json())

app.options('/posts/:id', cors())
.get('/posts/:id', (req,res)=>{
    const id = req.params.id;
    Post.findById(id)
    .then((result)=>{
        res.json(result)
        console.log('wuhuuu founddd the post with id')
    }).catch((err)=>{
        //console.log(err)
        res.status(404).send(`no document with this id ${err}`)
    })
})
.delete('/posts/:id',(req,res)=>{
    const id =req.params.id;
    Post.deleteOne({_id: id})
    .then((result)=>{
        if(!result){
            res.status(400).json({"message":"delete was unnnnnsuccessful"})
        }
       // res.send(result)
       res.status(200).json({"message":"delete was so successful"})
       console.log("deleted successfully")
    }).catch((err)=>{
        res.status(404).send(err)
    })
})
app.get('/posts', (req,res)=>{
    // console.log(req.query.title)
    // res.send(`hii everybody ${req.query.title}`)
    Post.find()
    .then((result)=>{
        console.log('fetched all data successfully')
        res.status(200).json(result)
    })
})


app.post('/create', (req,res)=>{
   let newPost = new Post({
       title: req.body.title,
       body:req.body.body
   })
   newPost.save()
   .then((result)=>{
        console.log(`successfully added to database`)
        res.json({
            "title": result.title,
            "body": result.body
        })
   }).catch((err)=>{
       console.log(`post not added to databse because of ${err}`)
   })
})

app.listen(PORT, ()=>{
    console.log(`server started at port ${PORT}`)
    console.log(process.env.NODE_ENV)
    console.log(process.env.MONGO_URL)
    console.log(process.env.PORT)
    
});
module.exports = app;
