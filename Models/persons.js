const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI;

console.log(`Connecting to ${url}...`);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((error) => {
    console.log("Error connecting to database:", error.message);
  });

const PhoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{4}-\d{7}/.test(v);
      },
      message: () => "Invalid phone! Correct format: 0000-0000000"
    },
  },
  visible: Boolean,
});

PhoneSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Phone", PhoneSchema);
