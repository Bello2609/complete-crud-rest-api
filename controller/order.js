const Order = require("../model/order");
const Product = require("../model/product");
exports.getOrder = ((req, res, next)=>{
    Order.find().select("product quantity _id").populate("product").exec().then(order=>{
        const response = {
            count: order.length,
            orders: order.map(od=>{
                return {
                    id: od._id,
                    product: od.product,
                    quantity: od.quantity,
                    request: {
                        type: "GET",
                        url: `http://localhost:8000/order`
                    }
                }
            })
        }
        res.status(200).json(response)
    })
    
});
exports.postOrder = ((req, res, next)=>{
    const { quantity, productId } = req.body;
    Product.findById(productId).exec().then(product=>{
        if(!product){
            res.status(404).json({
                message: 'No product found',
                error: err
            })
        }
        const order = new Order({
            product: product,
            quantity: quantity
        })
        return order.save().then(orders=>{
            res.status(201).json({
                message: "Order saved",
                createdOrder: {
                    product: orders.product,
                    quantity: orders.quantity
                }
            })
        }).catch(err=>{
            res.status(500).json({
                message: "order not saved",
                error: err
            })
        });
    }).catch(err=>{
        res.status(500).json({
            message: "No Product found here",
            error: err
        })
    });
    
   
});
exports.byIdOrder = ((req, res, next)=>{
    const id = req.params.orderId;
    Order.findById(id).select(" _id quantity product ").populate("product").exec().then(order=>{
        if(order){
            res.status(201).json({
                orders: order,
                request: {
                    type: "GET",
                    url: `http://localhost:8000/orders/${order._id}`
                } 
            });
        }else{
            res.status(404).json({
                message: "No Order is found",
               
            });
        }
    })
});

exports.patchOrder = ((req, res, next)=>{
    res.status(200).json({
        message: "Order updated"
    })
})

exports.deleteOrder = ((req, res, next)=>{
    const id = req.params.OrderId;
    Order.deleteOne({_id: id}).exec().then(order=>{
        res.status(200).json({
            message: "Order deleted",
            request: {
                method: "DELETE",
                url: `http://localhost:8000/order`,
                body: {
                    productId: "ID",
                    quantity: "Number" 
                }
            }
        });
    })
})
