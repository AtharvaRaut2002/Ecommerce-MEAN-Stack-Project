import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
export const createCategoryController = async(req, res) =>{
    try{
        const {name} = req.body
        if(!name) {
            return res.status(401).send({message: 'Name is Required'})
        }

        const existingCategory = await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: 'Category Already Exists'
            })   
        }
        const category = await new categoryModel({name, slug: slugify(name),}).save();
        res.status(201).send({
            success: true,
            message: 'new category created',
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in category'
        })
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body
        const {id} = req.params
        const category =  await categoryModel.findByIdAndUpdate(id, {name, slig: slugify(name)}, {new: true})

        res.status(200).send({
            success: true,
            message: "Category updated Successfully",
            category
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while updating category"
        })
    }
};

export const CategoryController = async (req, res) => {
    try{
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All categories list",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting all categories"
        })
    }
};

export const singleCategoryController = async (req, res) => {
    try{ 
        const {id} = req.params
        const category = await categoryModel.findOne({slug: req.params.slug})
        res.status(200).send({
            success: true,
            message: "Get single category successfully",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while getting a single category"
        })
    }
}

export const deleteCategoryController = async(req, res) => {
    try{ 
        const {id} = req.params
        await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success: true,
            message: "Category deleted successfully"
        })
    } catch (error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error while deleting category"
        })
    }
}