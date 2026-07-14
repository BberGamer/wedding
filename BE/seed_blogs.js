const mongoose = require("mongoose");
const dotenv = require("dotenv");
const BlogPost = require("./models/BlogPost");

dotenv.config();

const samplePosts = [
  {
    title: "Chào mừng các bạn đến với AN Wedding!",
    type: "facebook",
    facebookUrl: "https://www.facebook.com/facebook/posts/10158791439016729",
    author: "AN Wedding",
  },
  {
    title: "10 bước chuẩn bị đám cưới trong mơ cho các cặp đôi",
    type: "facebook",
    facebookUrl: "https://www.facebook.com/facebook/posts/10159021791851729",
    author: "Cố vấn AN Wedding",
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB for seeding blogs...");
    
    // Clear existing blogs
    await BlogPost.deleteMany({});
    console.log("Cleared old blog posts.");

    // Insert samples
    const created = await BlogPost.insertMany(samplePosts);
    console.log(`Successfully seeded ${created.length} sample blog posts!`);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error seeding blogs:", err);
  });
