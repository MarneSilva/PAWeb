/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error'; 
export default async function register(app, options) {

    const users = app.mongo.db.collection('users');

    app.get('/register', 
        {
            config: {
                logMe: true
            }
        }, 
        async (request, reply) => {
            return await users.find().toArray();
        }
    );

    app.post('/register', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    id: { type: 'integer' },
                    username: { type: 'string' },
                    password: { type: 'string'}
                },
                required: ['username', 'password']
            }
        },
        config: {
            requireAuthentication: false
        }
    }, async (request, reply) => {
        let user = request.body;
        
        await users.insertOne(user);

        return reply.code(201).send();
    });

    app.get('/register/:id', async (request, reply) => {
        let id =  request.params.id;
        let user = await users.findOne({_id: new app.mongo.ObjectId(id)});
        
        return user;
    });
    
    app.delete('/register/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        
        await users.deleteOne({_id: new app.mongo.ObjectId(id)});
        
        return reply.code(204).send();
    });

    app.put('/register/:id', {
        config: {
            requireAuthentication: true
        }
    }, async (request, reply) => {
        let id =  request.params.id;
        let user = request.body;
        
        await users.updateOne({_id: new app.mongo.ObjectId(id)}, {
            $set: {
                username: user.username,
                password: user.password
            }
        });
        
        
        return reply.code(204).send();
    });
}   