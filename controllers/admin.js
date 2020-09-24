const { totalmem } = require('os');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product', 
    path: '/admin/add-product',
    editing: false,
  });
}

exports.postAddProduct = (req,res,next)=> {
  const {title, price, imageUrl, description} = req.body
  Product.create({ //build only gets back javascript, save gets js and saves it to SQL
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
    .then(result => console.log("Created Product: " + title))
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) { return res.redirect('/') }
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if(!product) { return res.redirect('/') }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product', 
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
}

exports.postEditProduct = (req, res, next) => {
  // const prodId = req.body.productId;
  const { productId, title, imageUrl, description, price } = req.body
  const updatedProd = new Product(productId, title, imageUrl, description, price)
  updatedProd.save();
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        prods: products, 
        pageTitle: 'Admin Products', 
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req,res,next) => {
  const { productId } = req.body
  Product.deleteById(productId);
  res.redirect('/admin/products')
}