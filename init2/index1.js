const mongoose= require("mongoose");
const initData= require("./data1.js");
const Listing= require("../modules/listing.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) =>{
    console.log(err);
  });

  async function  main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
  }

  const initDB= async () =>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj) => ({...obj, owner : "680dba827b1cdc5a82f39987"}));
    await Listing.insertMany(initData.data);
    console.log("data was initilized");
  };

  initDB();