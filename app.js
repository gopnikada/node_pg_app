const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cons = require('consolidate')
const exphbs = require('express-handlebars')
const pg = require('pg')
const { Pool} = require('pg')
const app = express()



const connectStr = 'postgres://postgres:1234@localhost/recipebookdb'
//DB connection object
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'index',
}));


//set public folder
app.use(express.static(path.join(__dirname, 'public')))

//body parser middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

const pool = new Pool(

    {
    user: 'postgres',
    host: 'localhost',
    database: 'recipebookdb',
    password: '1234',
    port: 5432,}
    )

app.get('/', async (req, res) => {

    pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err)
        process.exit(-1)
    })
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT * FROM recipes', (err, result) => {
            done()
            if (err) {
                console.log(err.stack)
            } else {
                res.render('main', {layout : 'index', recipes: result.rows})
            }
        })
    })
})
app.delete('/delete/:id', (req,res)=>{
    pool.connect((err,client, done)=>{
        {
            if (err)
                return console.error(err)
            pool.query('DELETE FROM recipes WHERE id = $1 returning *', [req.params.id])

            done()
             res.sendStatus(200)
        }})

})

app.post('/add',   (req,res)=>{
    pool.connect((err,client, done)=>{
        {
            if (err)
                return console.error(err)
            pool.query('INSERT INTO recipes (name, ingredients, directions) VALUES ($1, $2, $3) returning *', [req.body.name, req.body.ingredients, req.body.directions])

            done()
            res.redirect('/')
    }})
})
app.post('/edit', (req,res)=>{
    pool.connect((err,client, done)=>{
        {
            if (err)
                return console.error(err)
            pool.query('UPDATE recipes SET name=$1, ingredients =$2, directions=$3 WHERE id=$4', [req.body.name, req.body.ingredients, req.body.directions, req.body.id])

            done()
            res.redirect('/')
        }})
})

app.listen(3000, ()=> {
    console.log("Started at 3000")})

