const chai = require('chai')
const chaiHttp = require('chai-http')
const Post = require('../models/Post')
const app = require('../index')
const mongoose = require('../database/conn')
//mongoose.connect('mongodb://localhost:27017/wordPressTest')
const should = chai.should()
chai.use(chaiHttp)

process.env_NODE_ENV = 'test';

describe('Post', () => {
     beforeEach((done)=>{
         const newPost = new Post({
             title: "test",
             body:"i am pissed off"
         })
         newPost.save(()=>{
             done();
         })
     })
    it('should GET ALL POSTS', (done) => { 
        chai.request(app)
            .get('/posts')
            .end((err, res)=> {

                res.should.have.status(200);
                res.body.should.be.a('Array')
                res.body[0].should.be.a('Object')
                 res.body[0].should.have.property('title')
                 res.body[0].should.have.property('body')

                done();
            })
   
    })
    it('should return an ERROR when trying to GET POST with wrong ID', (done) => {
        chai.request(app)
            .get('/posts/123')
            .end((err, res)=> {
                res.should.have.status(404)
                res.body.should.be.a('Object')
                done();
            })

    })
    it('should GET a POST with a specific ID', (done) => {
        let testPost = new Post({
            title: "the story of us",
            body: "i just made this up heheheheh"
        })
        testPost.save()
        .then((result)=>{
            chai.request(app)
            .get(`/posts/${result._id}`)
            .end((err, res)=> {
                res.should.have.status(200);
                res.body.should.be.a('Object')
                done();
            })
        }).catch((err)=>{
            console.log(err)
        })

    })
    it('should DELETE a POST with a specific ID', (done) => {
        let testPost = new Post({
            title: "the title of delete",
            body: "bodeyyyy od felete"
        })
        testPost.save()
        .then((result)=>{
            chai.request(app)
            .delete(`/posts/${result._id}`)
            .end((err, res)=> {
                res.body.message.should.equal('delete was so successful')
                res.should.have.status(200);
                res.body.should.be.a('Object')
                done();
            })
        }).catch((err)=>{
            console.log(err)
        })
        
    })
    
    it('should return an ERROR when trying to DELETE a post with wrong id', (done) => {
        chai.request(app)
            .delete('/posts/123')
            .end((err, res)=> {
                res.should.have.status(404)
                res.body.should.be.a('Object')
                res.body.name.should.equal('CastError')
                done();
            })
   
    })


    it('should CREATE a new POST with properties body and title ', (done) => {
        chai.request(app)
            .post('/create')
            .send({"title":"this is a new title","body":"this is a new body"}) //send the title and the book the postwith 
            .end((err, res)=> {
                res.body.should.have.property('title')
                res.body.should.have.property('body')
                res.should.be.json;
                res.should.have.status(200);
                done();
            })
      
    })
    // afterEach((done)=>{
    //     mongoose.connection.dropDatabase();
    //     done();
    // })
})
