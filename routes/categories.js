/** @type{import('fastify').FastifyPluginAsync<>} */
import createError from '@fastify/error';

export default async function categories(app, options) {

    app.get('/categories', async (request, reply) => {
            return ['legumes', 'frutas'];
        }
    );
}