import fastify from 'fastify';
import createError from '@fastify/error';
import fastifyStatic from '@fastify/static';
import spa from './routes/spa.js';
import movies from './routes/movies.js';
import products from './routes/products.js';


const MyCustomError = createError('MyCustomError', 'Something stranged happened.', 501);

export async function build(opts){
    const app = fastify(opts);

    app.register(fastifyStatic, {
        root: `${import.meta.dirname}/public`,
        wildcard: false
    });
    
    

    app.get('/error', (request, reply) => {
        throw new MyCustomError();
    });

    app.register(spa);
    app.register(movies);
    app.register(products);

    app.setErrorHandler(async (error, request, reply) => {
        const { validation } = error;
        request.log.error({ error });
        reply.code(error.statusCode || 500);
        return validation ? `Validation error: ${validation[0].message}.` : 'Internal Server Error';
    });

    app.get('/notfound', async (request, reply) => {
        request.log.info('Sending to not found handler.');
        reply.callNotFound();
    });

    app.setNotFoundHandler(async (request, reply) => {
        reply.code(404);
        return 'Resource not found.';
    });

    return app;
}