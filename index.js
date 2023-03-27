const { request } = require('express')
const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkIdOrder = (request, response, next) => {
    
    const { id } = request.params
    
    const index = orders.findIndex( order => order.id === id)
    
    if(index < 0) {
        return response.status(404).json({message:'Order not found'})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const info = (request, response, next) => {                                   //informações de método e url

    console.log(request.method, request.url)  
    
    next()

}

app.get('/orders', info, (request, response) => {                            //todos os pedidos

    return response.json(orders)
})

app.get('/orders/:id', checkIdOrder, info, (request, response) => {          //pedido pelo id
    
    const index = request.orderIndex
    
    return response.json(orders[index])
})
 
app.post('/orders', info, (request, response) => {                           //novo pedido
    
    const { clientName, order, price } = request.body
    const finalOrder = { id:uuid.v4(), clientName, order, price, status:"Em Preparação" }

    orders.push(finalOrder)


    return response.status(201).json(finalOrder)
})

app.put('/orders/:id', checkIdOrder, info, (request, response) => {          //alterar pedido
    
    const { clientName, order, price } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatadOrder = { id, clientName, order, price, status:"Em Preparação" }

    orders[index] = updatadOrder

    return response.json(updatadOrder)
})

app.delete('/orders/:id', checkIdOrder, info, (request, response) => {       //apagar pedido

    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(200).json({message: 'Order Deleted'})
})

app.patch('/orders/:id', checkIdOrder, info, (request, response) => {        //atualizar status
    
    const index = request.orderIndex
    const id = orders[index].id
    const clientName = orders[index].clientName
    const order = orders[index].order
    const price = orders[index].price

    const finishOrder = { id, clientName, order, price, status:"Pronto" }
    orders[index] = finishOrder

    return response.json(finishOrder)
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}.`);
})

