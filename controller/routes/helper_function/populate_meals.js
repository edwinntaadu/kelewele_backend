const Meals = require('../../../models/mealData'); // Import the Meals model

async function populateMeals() {
  const ghanaianDishes = [
    {
      name: "Jollof Rice",
      description: "A popular rice dish cooked with tomatoes, spices, and vegetables.",
      price: 25,
      category: "Main Course",
      availability: true,
      ingredients: [
        { name: "Rice", quantity: "2 cups" },
        { name: "Tomatoes", quantity: "3 large" },
        { name: "Onions", quantity: "2 medium" },
        { name: "Chicken", quantity: "500g", optional: true },
      ],
      imageUrl: "https://example.com/jollof.jpg",
      preparationTime: 45,
      calories: 400,
      tags: ["Spicy", "Popular"],
      sellerType: "Restaurant",
      sellerName: "Mama's Kitchen",
      sellerId: "6456a1b2c3d4e5f678901234",
    },
    {
      name: "Fufu and Light Soup",
      description: "A traditional dish made with cassava and plantain, served with light soup.",
      price: 30,
      category: "Main Course",
      availability: true,
      ingredients: [
        { name: "Cassava", quantity: "2 pieces" },
        { name: "Plantain", quantity: "2 pieces" },
        { name: "Tomatoes", quantity: "4 large" },
        { name: "Goat Meat", quantity: "500g" },
      ],
      imageUrl: "https://example.com/fufu.jpg",
      preparationTime: 60,
      calories: 500,
      tags: ["Traditional", "Soup"],
      sellerType: "Private",
      sellerName: "Auntie Akos",
      sellerId: "6456a1b2c3d4e5f678901235",
    },
    {
      name: "Banku and Tilapia",
      description: "Fermented corn and cassava dough served with grilled tilapia and pepper sauce.",
      price: 35,
      category: "Main Course",
      availability: true,
      ingredients: [
        { name: "Corn Dough", quantity: "2 cups" },
        { name: "Cassava Dough", quantity: "1 cup" },
        { name: "Tilapia", quantity: "1 large" },
        { name: "Pepper", quantity: "3 pieces" },
      ],
      imageUrl: "https://example.com/banku.jpg",
      preparationTime: 50,
      calories: 450,
      tags: ["Grilled", "Spicy"],
      sellerType: "Restaurant",
      sellerName: "Tilapia Joint",
      sellerId: "6456a1b2c3d4e5f678901236",
    },
    {
      name: "Waakye",
      description: "A rice and beans dish served with fried plantain, boiled egg, and meat.",
      price: 20,
      category: "Main Course",
      availability: true,
      ingredients: [
        { name: "Rice", quantity: "2 cups" },
        { name: "Beans", quantity: "1 cup" },
        { name: "Plantain", quantity: "2 pieces" },
        { name: "Egg", quantity: "1 piece" },
      ],
      imageUrl: "https://example.com/waakye.jpg",
      preparationTime: 40,
      calories: 350,
      tags: ["Popular", "Vegetarian"],
      sellerType: "Private",
      sellerName: "Waakye Spot",
      sellerId: "6456a1b2c3d4e5f678901237",
    },
    {
      name: "Kenkey and Fish",
      description: "Fermented corn dough served with fried fish and pepper sauce.",
      price: 15,
      category: "Main Course",
      availability: true,
      ingredients: [
        { name: "Corn Dough", quantity: "2 balls" },
        { name: "Fish", quantity: "1 large" },
        { name: "Pepper", quantity: "3 pieces" },
        { name: "Onions", quantity: "1 medium" },
      ],
      imageUrl: "https://example.com/kenkey.jpg",
      preparationTime: 30,
      calories: 300,
      tags: ["Traditional", "Spicy"],
      sellerType: "Restaurant",
      sellerName: "Kenkey House",
      sellerId: "6456a1b2c3d4e5f678901238",
    },
    // Add 15 more dishes here...
  ];

  try {

    console.log("Populating meals table with Ghanaian dishes...");
    await Meals.insertMany(ghanaianDishes);
    console.log("Successfully populated the meals table with Ghanaian dishes.");
    return 250
  } catch (error) {
    console.error("Error populating meals table:", error);
    return 500
  }
}

//populateMeals();

module.exports = { populateMeals };