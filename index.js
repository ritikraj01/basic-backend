const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const multer = require('multer');




const app = express();


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/assets/'); // Directory where files will be saved
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Save file with timestamp + original extension
    },
 });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      // Accept only PNG files
      if (file.mimetype === 'image/png') {
        cb(null, true);
      } else {
        cb(new Error('Only PNG files are allowed!'));
      }
    },
  });
  

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');


let items = [
    {
        id:uuidv4(),
        username: "@ritikraj",
        caption:"hdfkhdgjlhfkxkhjkizdl",
        image:"/assets/image1.png"
    },
    {
        id:uuidv4(),
        username: "@kallukabdi",
        caption:"hdfkhdgjlhfkxkhdjkjxjkizdl",
        image:"/assets/image2.png"
    },
    {
        id:uuidv4(),
        username: "@djchinm",
        caption:"hdfkhdgjlhfkxkhgrjhugrkr,sjksjgskujkizdl",
        image:"/assets/image3.png"
    }
];

// Define a route
app.get('/', (req, res) => {

    res.render('home', { items });
});

app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const data = items.filter(user => user.id === userId);
    res.render('editForm', {data});
});

app.get('/new', (req, res) => {
    res.render('newForm');
});

app.post('/submit-form', upload.single('photo') ,(req, res) => {
    const {username , caption} = req.body;
    let str = "/assets/";
    try {
        if (!req.file) {
          throw new Error('No file uploaded!');
        }
        str += req.file.filename; // Access uploaded file info
       
      } catch (err) {
        res.status(400).send(err.message);
      }
    const newId = uuidv4();
    const newuser = {id:newId , username:username,caption:caption , image:str};
    items.push(newuser);
    res.redirect('/');
});


app.patch('/submit-form/:userId', upload.single('photo') , (req, res) => {
    const userId = req.params.userId;
    const { caption } = req.body;
    let str = "/assets/";
    try {
        if (req.file) {  
        str += req.file.filename; // Access uploaded file info
        }
       
      } catch (err) {
        res.status(400).send(err.message);
    }

    const index = items.findIndex(user => user.id === userId);
    items[index].caption = caption;
    if (req.file) {items[index].image = str;}
    res.redirect('/');
});


app.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    const index = items.findIndex(user => user.id === userId);
    items.splice(index, 1);
    res.redirect('/');
});

// Start the server on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});