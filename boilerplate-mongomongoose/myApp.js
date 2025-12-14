require('dotenv').config();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Person;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

Person = mongoose.model('Person', personSchema);

var createAndSavePerson = function (done) {
  var janeFonda = new Person({ name: "Jane Fonda", age: 84, favoriteFoods: ["eggs", "fish", "fresh fruit"] });

  janeFonda.save(function (err, data) {
    if (err) return console.error(err);
    done(null, data)
  });
};;

var arrayOfPeople = [
  { name: "Frankie", age: 74, favoriteFoods: ["Del Taco"] },
  { name: "Sol", age: 76, favoriteFoods: ["roast chicken"] },
  { name: "Robert", age: 78, favoriteFoods: ["wine"] }
];

var createManyPeople = function (arrayOfPeople, done) {
  Person.create(arrayOfPeople, function (err, people) {
    if (err) return console.log(err);
    done(null, people);
  });
};


const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, people) => {
    if (err) return console.log(err);
    done(null, people)
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: [food] }, (err, food) => {
    if (err) return console.log(err);
    done(null, food)
  })
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, Id) => {
    if (err) return console.log(err);
    done(null, Id)
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = 'hamburger';
  Person.findById({ _id: personId }, (err, Id) => {
    if (err) return console.log(err);
    Id.favoriteFoods.push(foodToAdd)


    Id.save((err, updatedPerson) => {
      if (err) return console.log(err);
      done(null, updatedPerson)
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate({name: personName}, {age: ageToSet}, {new: true}, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};


const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, updatedDoc) => {
    if(err) return console.log(err);
    done(null, updatedDoc);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove}, (err, people) => {
    if (err) return console.log(err);
    done(null, people)
  })
};

const queryChain = (done) => {
  const foodToSearch = 'burrito';
  Person.find({ favoriteFoods: foodToSearch })
  .sort({ name: 1 })
  .limit(2)
  .select({age: 0})
  .exec((err,data)=>{
    if(err) return console.log(err);
    done(null, data)
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
