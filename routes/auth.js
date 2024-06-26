/** @type{import('fastify').FastifyPluginAsync<>} */
export default async function auth(app, options) {
    
    app.post('/auth', {
        schema: {
            body: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                    password: { type: 'string' }
                },
                required: ['username', 'password']
            }
        }
    }, (request, reply) => {
        
        let user = request.body;
        request.log.info(`Login for user ${user.username}`);
        //check login details
        delete user.password;
        return {
            'x-access-token' : app.jwt.sign(user)
        }
    });
}