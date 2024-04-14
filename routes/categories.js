/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidCategoriesError = createError('InvalidCategoriesError', 'Categoria Inválida.', 400);
    const categories = app.mongo.db.collection('categories');
    const products = app.mongo.db.collection('products');

    app.get('/categories', 
        {
            config: {
                logMe: true
            }
        }, 
        async (request, reply) => {
            return await categories.find().toArray();
        }
    );

    app.get('/categories/:id/products', 
        {
            config: {
                logMe: true
            }
        },
        async (request, reply) => {
            let category = await categories.findOne({_id: request.params.id});
            let categoryName = category.name;
            let productsCategory = await products.find({category: categoryName}).toArray();
            return productsCategory;   
        }
    )
    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    img_url: {type: 'string'}
                },
                required: ['name', 'img_url']
            }
        },
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let category = request.body; 
        await categories.insertOne(category);
        return reply.code(201).send();
    });
    
    app.get('/categories/:id', async (request, reply) => {
        let id =  request.params.id;
        let category = await categories.findOne({_id: id});
        
        return category;
    });
    
    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await categories.deleteOne({_id: id});
        
        return reply.code(204).send();;
    });

    app.put('/categories/:id', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    name: { type: 'string' },
                    img_url: {type: 'string'}
                },
                required: ['name', 'img_url']
            }
        },
        config: {
            requireAuthentication: true,
            checkAdmin: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let category = request.body;
        
        await categories.updateOne({_id: id}, {
            $set: {
                name: category.name,
                img_url: category.img_url
            }
        });
        
        return reply.code(204).send();;
    });
}