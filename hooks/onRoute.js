/** @type{import('fastify').FastifyPluginAsync<>} */
import {checkExistence, checkExistenceCat, checkExistenceReg, extractUser, logMe} from './functions/index.js';
import { userIsAdmin } from './functions/register/userIsAdmin.js';

export default async function onRouteHook(app, options) {
    app.addHook('onRoute', (routeOptions) => {
        if(routeOptions.onRequest && !Array.isArray(routeOptions.onRequest)){
            routeOptions.onRequest = [routeOptions.onRequest];
        }else{
            routeOptions.onRequest = [];
        }
        if(routeOptions.preHandler && !Array.isArray(routeOptions.preHandler)){
            routeOptions.preHandler = [routeOptions.preHandler];
        }else{
            routeOptions.preHandler = [];
        }

        if(routeOptions.config?.logMe){
            routeOptions.onRequest.push(logMe(app));
        }
        if(routeOptions.config?.requireAuthentication){
            routeOptions.onRequest.push(extractUser(app));
        }
        if(routeOptions.config?.checkAdmin){
            routeOptions.onRequest.push(userIsAdmin(app));
        }
        if(routeOptions.url === '/products' && routeOptions.method === 'POST'){
            routeOptions.preHandler.push(checkExistence(app));
        }
        if(routeOptions.url === '/categories' && routeOptions.method === 'POST'){
            routeOptions.preHandler.push(checkExistenceCat(app));
        }
        if(routeOptions.url === '/register' && routeOptions.method === 'POST'){
            routeOptions.preHandler.push(checkExistenceReg(app));
        }
    });
}