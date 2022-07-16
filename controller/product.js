const Product = require("../model/product");
const multer = require("multer");

//this will determine where the imaes will be stored
const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "Images");
    },
    filename: (req, file, cb)=>{
        cb(null, new Date.toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb)=>{
    //this will reject a file that is  not in compliance with the image format
    if(file.mimetype === "image/jepg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // the maximum filesize this can take is 5mb
    }
});
exports.getProduct = ((req, res, next)=>{
    Product.find().select("name price _id").exec()
    .then(prod=>{
        const response = {
            count: prod.length,
            products: prod.map(doc=>{
                return {
                    id: doc._id,
                    name: doc.name,
                    price: doc.price,
                    request: {
                        type: "GET",
                        url: `http://localhost:3000/product/${doc._id}`
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err=>{
        res.status(500).json({
            message: err
        })
    });
});
exports.postProduct = (upload.single("productImage"), (req, res, next)=>{
    console.log(req.file)
    const products = new Product({
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    products.save().then(prod=>{
        console.log(prod);
        res.status(201).json({
            message: "post product",
            createdProduct: {
                name: prod.name,
                price: prod.price,
                _id: prod._id
            }
        })
    })
    
});
exports.byIdProduct = ((req, res, next)=>{
   const id = req.params.productId;
   Product.findById({_id: id}).select("name price _id").exec().then(result=>{
       if(result){
           const prodResult = {
               
               name: result.name,
               price: result.price,
               _id: result._id,
               request: {
                   method: "GET",
                   url: `http://localhost:8000/order`
               }
           }
           res.status(200).json(prodResult);
       }else{
           res.status(404).json({
                message: "No product is found"
           });
       }
   }).catch(err=>{
       res.status(500).json({
           error: err
       })
   })
});

exports.patchProduct = ((req, res, next)=>{
    const id = req.params.productId;
    let updatedProduct = {};
    for(const op of req.body){
        updatedProduct[op.propName] = op.value
    }
    Product.updateOne({_id: id}, {$set: updatedProduct})
    .exec()
    .then(prod=>{
        res.status(200).json(updatedProduct)
    })
});
exports.deleteProduct = ((req, res, next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id: id}).exec().then(prod=>{
        res.status(200).json({
            message: "Product Deleted",
            request: {
                type: "POST",
                url: `http://localhost:3000/product`,
                body: {
                    name: "String",
                    price: "Number"
                }
            }
        });
    }).catch(err=>{
        res.status(500).json({
            message: err
        })
    })
    res.status(200).json({
        message: "product deleted"
    })
})
