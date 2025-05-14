const Sellers = require('../../../models/sellersData'); // Import the Meals model


async function populateSellers() {
  const sellersData = [
    {
      name: "Mama's Kitchen",
      email: "mama@example.com",
      phone: "0241234567",
      sellerType: "Business",
      rating: 4.5,
      profileId: "6456a1b2c3d4e5f678901234", // Replace with actual UserProfile ID
      address: {
        street: "123 Main Street",
        city: "Accra",
        state: "Greater Accra",
        zip: "00233",
      },
    },
    {
      name: "Auntie Akos",
      email: "akos@example.com",
      phone: "0249876543",
      sellerType: "Private",
      rating: 4.8,
      profileId: "6456a1b2c3d4e5f678901235", // Replace with actual UserProfile ID
      address: {
        street: "456 Market Road",
        city: "Kumasi",
        state: "Ashanti",
        zip: "00234",
      },
    },
    {
      name: "Tilapia Joint",
      email: "tilapia@example.com",
      phone: "0245678901",
      sellerType: "Business",
      rating: 4.2,
      profileId: "6456a1b2c3d4e5f678901236", // Replace with actual UserProfile ID
      address: {
        street: "789 Riverside Drive",
        city: "Cape Coast",
        state: "Central",
        zip: "00235",
      },
    },
    {
      name: "Kenkey House",
      email: "kenkey@example.com",
      phone: "0243456789",
      sellerType: "Business",
      rating: 4.0,
      profileId: "6456a1b2c3d4e5f678901237", // Replace with actual UserProfile ID
      address: {
        street: "321 Coastal Road",
        city: "Takoradi",
        state: "Western",
        zip: "00236",
      },
    },
    {
      name: "Waakye Spot",
      email: "waakye@example.com",
      phone: "0246543210",
      sellerType: "Private",
      rating: 4.7,
      profileId: "6456a1b2c3d4e5f678901238", // Replace with actual UserProfile ID
      address: {
        street: "654 Food Street",
        city: "Tamale",
        state: "Northern",
        zip: "00237",
      },
    },
    // Add more sellers as needed...
  ];

  try {
    await Sellers.insertMany(sellersData);
    console.log("Successfully populated the sellers table with sample data.");
  } catch (error) {
    console.error("Error populating sellers table:", error);
  }
}

module.exports = { populateSellers };