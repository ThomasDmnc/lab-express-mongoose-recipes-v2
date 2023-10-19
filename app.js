const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const Recipe = require('./models/Recipe.model');

// app.js
//...

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post('/recipes', (req, res, next) =>{
    const { title, instructions, level, ingredients, image, duration, isArchived, created } = req.body;
    Recipe.create(
        { title, instructions, level, ingredients, image, duration, isArchived, created }
        )
    .then( createdRecipe => {
        res.status(201).json(createdRecipe)
    }).catch((error) => {
        res.status(500).json({message: "error while creating recipe…"})
    })
});


//  Iteration 4 - Get All Recipes
//  GET  /recipes route

app.get('/recipes', (req, res) => {
    Recipe.find({})
    .then((recipes) => {
        res.status(201).json(recipes)
    }).catch((error) => {
        res.status(500).json({message: "error while retrieving all recipes…"})
    })
})

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:recipeId', (req, res) => {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        res.status(400).json({ message: `Specified id is not valid ${recipeId}` });
        return;
      }
    
    Recipe.findById(recipeId)
    .then((foundRecipe) =>{
        res.status(201).json(foundRecipe)
    }).catch((error) => {
        res.status(500).json({message: "error while getting recipe…"})
    })
})

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put('/recipes/:recipeId', (req, res) => {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    
    Recipe.findByIdAndUpdate(recipeId)
    .then((updatedRecipe) =>{
        res.status(201).json(updatedRecipe)
    }).catch((error) => {
        res.status(500).json({message: "error while updating recipe…"})
    })
})

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:recipeId', (req, res) => {
    const { recipeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
        res.status(400).json({ message: 'Specified id is not valid' });
        return;
      }
    
    Recipe.findByIdAndRemove(recipeId)
    .then(() =>{
        res.status(201).json({ message: `Recipe with ${recipeId} is removed successfully.`})
    }).catch((error) => {
        res.status(500).json({message: "error while deleting recipe…"})
    })
})

// BONUS
//  Bonus: Iteration 9 - Create a Single User
//  POST  /users route


//  Bonus: Iteration 10 | Get a Single User
//  GET /users/:id route


//  Bonus: Iteration 11 | Update a Single User
//  GET /users/:id route


// Start the server
app.listen(3000, () => console.log('My first app listening on port 3000!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;