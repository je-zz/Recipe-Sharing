require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Recipe = require('./Models/recipeDetails');
const UserModel = require('./Models/User');

const app = express();
const env = process.env;

const nodemailer = require('nodemailer');

const sendEmail = async (email, name, password) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'jesli.vcnr@gmail.com', 
      pass: 'cuuz mxrc uqtb nrab', 
    }
  });

  const mailOptions = {
    from: 'jesli.vcnr@gmail.com',
    to: email,
    subject: 'Account Created Successfully',
    html: `
      <h1>Welcome ${name}!</h1>
      <p>Your account has been created successfully.</p>
      <p>Email: ${email}</p>
      <p>Password: ${password}</p>
      <p>Please keep your credentials safe.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};


// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.static('uploads'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  secret: 'f32dc27491fd8d3b480bed5bfaaecb6880aaa27c46020d325ef26556715c6338343eb89a48ac45123c822ffd2aeb3ff681d0278c955b638c4fe61e149d2c4a8e', 
  resave: false,   
  saveUninitialized: false, 
  cookie: { 
    secure: false,  
    maxAge: 1000 * 60 * 60 * 24, 
  }
}));

const storage = multer.diskStorage({
  destination:(req, file, cb) =>{
    cb(null, 'uploads')
  },
  filename:(req, file, cb) =>{
    cb(null, file.fieldname + "_"+Date.now()+ path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Check if user is logged in (Session Validation)
app.get('/', (req, res) => {
  if (req.session.name) {
    return res.json({ valid: true, user: req.session.name });
  } else {
    return res.json({ valid: false });
  }
});


// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          req.session.userID = user._id; // Store userID in session
          req.session.name = user.name;
          req.session.save();
          res.json("Success");
        } else {
          res.json("Password is incorrect");
        }
      } else {
        res.json("No record existed");
      }
    });
});


// User Logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.clearCookie('sessionID') // Clear the session cookie
    res.send({ success: true });
  });
});


// User Registration
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const newUser = await UserModel.create({ name, email, password });

    // Send email after user registration
    await sendEmail(email, name, password);

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Post Recipe Details with Logged-in User
app.post('/postrecipedetails', upload.single('file'), async (req, res) => {
  try {
    if (!req.session.userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    console.log('Request Body:', req.body);
    console.log('Veg Type:', req.body.vegType);


    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients.split(", "),
      steps: req.body.steps.split(", "),
      cookingTime: req.body.cookingTime,
      servings: req.body.servings,
      cuisineType: req.body.cuisineType,
      difficulty: req.body.difficulty,
      image: req.file.filename,
      vegType: req.body.vegType,
      addedBy: req.session.userID // ✅ Store the user ID in database
    });
    

    await newRecipe.save();



    res.status(201).json(newRecipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


// Get All Recipes
app.get('/getrecipedetails', async (req, res) => {
  try {
    const data = await Recipe.find({});
    res.status(200).json(data);
  } catch (error) {
    res.sendStatus(500);
  }
});


// Get Logged-in User's Recipes
app.get('/getmyrecipes', async (req, res) => {
  try {
    if (!req.session.userID) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const myRecipes = await Recipe.find({ addedBy: req.session.userID });
    res.status(200).json(myRecipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});





// Update Password API
app.post('/update-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.password = newPassword; // You can hash the password here if needed
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search Recipes by Name or Ingredients
app.get('/search-recipes', async (req, res) => {
  const { query } = req.query;

  try {
    const recipes = await Recipe.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Search by name (case-insensitive)
        { ingredients: { $regex: query, $options: 'i' } }, // Search by ingredients
        { vegType: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Get Logged-in User's Email
app.get('/get-user-email', async (req, res) => {
  try {
    if (!req.session.userID) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await UserModel.findById(req.session.userID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update Recipe
// Update Recipe
app.put('/update-recipe/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { name, description, ingredients, steps, cookingTime, servings, cuisineType, difficulty, vegType } = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, {
      name,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(', '),
      steps: Array.isArray(steps) ? steps : steps.split(', '),
      cookingTime,
      servings,
      cuisineType,
      difficulty,
      vegType
    }, { new: true });

    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe updated successfully', updatedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete Recipe
app.delete('/delete-recipe/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);

    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/recipe')
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server Listening
app.listen(env.PORT, () => {
  console.log('Listening on Port', env.PORT);
});
