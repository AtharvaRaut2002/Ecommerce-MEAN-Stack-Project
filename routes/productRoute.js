import express from 'express'
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getsingleProductController, productCategoryController, productCountController, productFilterController, productListController, productPhotoController, realtedProductController, searchController, updateProductController } from '../controllers/productController.js';
import formidable from 'express-formidable'

const productRoute = express.Router();

//routes
productRoute.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController)

// get all products
productRoute.get('/get-product', getProductController)

//single product 
productRoute.get('/get-product/:slug', getsingleProductController)

//get photo  
productRoute.get('/product-photo/:pid', productPhotoController)

//delete product
productRoute.delete('/delete-product/:pid', deleteProductController)

//update product
productRoute.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

//filter product
productRoute.post('/product-filters', productFilterController)

//Product Count
productRoute.get('/product-count', productCountController)

//product per page
productRoute.get('/product-list/:page', productListController)

//search Product
productRoute.get('/search/:keyword', searchController)

//category wise product
productRoute.get("/product-category/:slug", productCategoryController);

//similar product
productRoute.get("/related-product/:pid/:cid", realtedProductController);
export default productRoute;