const mongoose = require('mongoose');

// Import of the model Recipe from './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Import of the data from './data.json'
const data = require('./data');

const MONGODB_URI = 'mongodb://localhost:27017/recipe-app';

// Connection to the database "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`Connected to the database: "${mongoose.connection.name}"`);
    // Before adding any recipes to the database, let's remove all existing ones
    return Recipe.deleteMany();
  })
  .then(() => {
    // Add a single recipe to the database
    const newRecipe = {
      title: 'Delicious Pancakes',
      level: 'Easy Peasy',
      ingredients: [
        '2 cups all-purpose flour',
        '2 tablespoons sugar',
        '1 teaspoon baking powder',
        '1/2 teaspoon salt',
        '2 cups milk',
        '2 large eggs',
        '1/4 cup unsalted butter, melted',
      ],
      cuisine: 'International',
      dishType: 'breakfast',
      image: 'https://images.media-allrecipes.com/images/75131.jpg',
      duration: 30,
      creator: 'Chef John',
      created: new Date(),
    };

    return Recipe.create(newRecipe);
  })
  .then((createdRecipe) => {
    console.log(`Added recipe: ${createdRecipe.title}`);
    // Add multiple recipes to the database
    return Recipe.insertMany(data);
  })
  .then((insertedRecipes) => {
    console.log('Added the following recipes:');
    insertedRecipes.forEach((recipe) => {
      console.log(recipe.title);
    });

    // Update the duration of "Rigatoni alla Genovese" to 100
    return Recipe.findOneAndUpdate(
      { title: 'Rigatoni alla Genovese' },
      { duration: 100 },
      { new: true }
    );
  })
  .then((updatedRecipe) => {
    console.log(`Updated duration of "${updatedRecipe.title}" to 100.`);

    // Remove the "Carrot Cake" recipe from the database
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    console.log('Removed "Carrot Cake" from the database.');
    // Log the titles of all recipes in the database
    return Recipe.find({}, 'title');
  })
  .then((allRecipes) => {
    console.log('All recipes in the database:');
    allRecipes.forEach((recipe) => {
      console.log(recipe.title);
    });
    // Close the database connection after all operations are completed
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error:', error);
    // Close the database connection on error as well
    mongoose.connection.close();
  });
