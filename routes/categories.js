/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';
export default async function categories(app, options) {
    const InvalidcategorieError = createError('InvalidcategorieError', 'Categoria Inválida.', 400);

    const categories = app.mongo.db.collection('categories');

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

    app.post('/categories', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    img_url: {type: 'string'},
                    name: { type: 'string' },
                },
                required: ['name', 'img_url']
            }
        },
        config: {
            requireAuthentication: false
        }
    }, async (request, reply) => {
        let categorie = request.body;
        
        await categories.insertOne(categorie);

        return reply.code(201).send();
    });

    app.get('/categories/:id', async (request, reply) => {
        let id =  request.params.id;
        let categorie = await categories.findOne({_id: new app.mongo.ObjectId(id)});
        
        return categorie;
    });
    
    app.delete('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await categories.deleteOne({_id: new app.mongo.ObjectId(id)});
        
        return reply.code(204).send();;
    });

    app.put('/categories/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let categorie = request.body;
        
        await categories.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                name: categorie.name,
                img_url: categorie.img_url
            }
        });
        
        return reply.code(204).send();;
    });
}