//write a function that adds a new document to the collection
//the name of the mongodb database is test  and the collection is test-collection   
//the function should take two parameters:
//the first parameter is the name of the document
//the second parameter is the content of the document
//the function should return the name of the document and the content of the document
//user mongoose to connect to the database
//use the collection test-collection
//use the function addDocument to add a new document to the collection
const mongoose = require('mongoose');
//using fakerjs library to generate random data for the name and content of the document
const faker = require('faker'); 


//write the function addDocument here using mongoose and the collection test-collection, use async await and try catch  to handle errors    
const addDocument = async (name, content) => {
    try {
        await mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
        const db = mongoose.connection;
        const collection = db.collection('test-collection');
        const result = await collection.insertOne({ name, content });
        db.close();
    } catch (error) {
        console.log(error); 
    }
  
    
}


//call the function addDocument here and using fakerjs library to generate random data for the name and content of the document
addDocument(faker.name.firstName(), faker.lorem.paragraph());






