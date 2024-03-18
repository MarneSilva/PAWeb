import { ALREADY_EXISTS } from "../../../libs/errors.js";
export const checkExistence = (app) => async (request, reply) => {
    app.log.info('Checando...')
    const products = app.mongo.db.collection('products');

    let product = request.body;
    let result = await products.find({name: product.name});
    if(result > 0) throw new ALREADY_EXISTS
}