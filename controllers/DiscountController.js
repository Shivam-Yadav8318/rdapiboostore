const Book = require('../models/Book')
const Discount = require('../models/Discount')
async function getBooks(req,res){
    try{
        // select_id, bookTitle from book => in my sql
        let books = await Book.find({},{_id:1, bookTitle:1}) // in  mongodb
        res.status(200).send({data:books})
    }
    catch(err){
        
        res.status(400).send({message:'something went wrong'})
    }
}
async function addDiscount(req,res){
    try{
    
        let discount = new Discount(req.body)
        await discount.save()
     res.status(200).send({message:'Discount added successfully'})
    }
    catch(err){
        
        res.status(400).send({message:'something went wrong'})
    }
}
async function getDiscounts(req,res){
    try{
        let discounts = await Discount.find({}) .populate('book');
        console.log(discounts)
        res.status(200).send({data:discounts})
    }
    catch(err){
        
        res.status(400).send({message:'something went wrong'})
    }
}
async function getDiscountForEdit(req,res){
    try{
        let id=req.params.id;
        let discount = await Discount.findOne({_id:id}).populate('book');
        res.status(200).send({data:discount})
    }
    catch(err){
        res.status(400).send({message:'something went wrong'})
    }
}

module.exports = {
    getBooks,
    addDiscount,
    getDiscounts,
    getDiscountForEdit  
}