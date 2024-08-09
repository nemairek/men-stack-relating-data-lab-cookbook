const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Food = require('../models/food')

router.get('/', async (req, res) => {
    const ownerId = req.session.user._id;
    let pantry = await Food.find({ owner: ownerId }).populate('owner')
    console.log(pantry)
    res.render('foods/index.ejs', {
      foods: pantry
    });
});


router.get("/new", (req, res) => {
  res.render("foods/new.ejs")
});

router.post("/", async (req, res) => {
  req.body.owner = req.session.user._id;
  await Food.create(req.body);
  res.redirect("/")
})

router.get('/:foodId', async (req, res) => {
  try {
      const populatedRecipes = await Food.findById(
        req.params.foodId
      ).populate('owner');
  
      res.render('foods/index.ejs', {
        food: populatedRecipes,
      });
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
});

router.delete('/:foodId', async (req, res) => {
  try {
      console.log(req.params.foodId)
    const food = await Food.findById(req.params.foodId);
    if (food.owner.equals(req.session.user._id)) {
      await food.deleteOne();
      res.redirect('/food');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.error(error);
    res.redirect('/');
  }
});


router.get('/:foodId/edit', async (req, res) => {
  try {
    const currentFood = await Food.findById(req.params.foodId);
    res.render('foods/edit.ejs', {
      food: currentFood,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

router.put('/:foodId', async (req, res) => {
  try {
    const currentFood = await Food.findById(req.params.foodIdId);
    if (currentFood.owner.equals(req.session.user._id)) {
      await currentFood.updateOne(req.body);
      res.redirect('foods/edit.ejs');
    } else {
      res.send("You don't have permission to do that.");
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

module.exports = router;