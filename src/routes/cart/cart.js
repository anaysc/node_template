const promotion_rules = [
    {
        "rule": "Nx$",
        "discount_percentage": 20,
        "n": 4
    },
    {
        "rule": "AyA",
        "discount_percentage": 15,
        "n": 1
    }
]


 exports.getPromotions = (ctx) => {
    const response = {
        "status": "",
        "cart_id": "",
        "total_cart_amount": 0,
        "details": []
    };
    let total = 0

    //const body = ctx.request.body
    //console.log(ctx.request.body.items)
    for (const product of ctx.request.body.items) {
        const item = {
            "item_id": "",
            "amount": 0,
            "total_price": 0,
            "promotion_applied": false
        }
        const response_error = {
            "status" : "",
            "error_message" : ""
        }
        if (product.amount <= 0 || product.unit_base_price <= 0){
            response_error.status = "NOK"
            response_error.error_message = "AMOUNT OR PRICE SHOULD BE GREATER THAN ZERO"
            ctx.body = response_error
            ctx.status  = 400
            return ctx
        }
        let precio_total = 0
        if (product.promotion === 'Nx$') {
            const n = promotion_rules.find(rule => rule.rule === 'Nx$').n
            const n_veces = Math.floor(product.amount / n)
            let total_con_descuento = 0;
            if (n_veces > 0) {
                total_con_descuento = n_veces * product.unit_base_price * (1 - promotion_rules.find(rule => rule.rule === 'Nx$').discount_percentage / 100)
                item.promotion_applied = true
            }
            else{
                item.promotion_applied = false
            }
            const unidades_restantes = product.amount % n
            const precio_unitario_sin_descuento = unidades_restantes * product.unit_base_price
            precio_total = total_con_descuento + precio_unitario_sin_descuento
            response.status = "OK"
        }
        else if (product.promotion === 'AyA') {
            const precio_unitario_con_descuento = product.unit_base_price * (1 - promotion_rules.find(rule => rule.rule === 'AyA').discount_percentage / 100)
            precio_total = product.amount * precio_unitario_con_descuento
            item.promotion_applied = true
            response.status = "OK"
        }
        else if (product.promotion === '') {
            item.promotion_applied = false
            precio_total = product.unit_base_price
            response.status = "OK"
        }
        else{
            response_error.status = "NOK"
            response_error.error_message = "RULE DOES NOT EXIST"
            ctx.body = response_error
            ctx.status  = 400
            return ctx
        }
        total = total + precio_total
        item.total_price = precio_total
        item.amount = product.amount
        item.item_id = product.item_id
        response.details.push(item)
    }
    response.cart_id = ctx.request.body.cart_id
    response.total_cart_amount = total
    ctx.body = response
    return ctx
}




    
    