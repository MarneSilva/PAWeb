import { UNAUTHORIZED_PERSONNEL } from "../../../libs/errors.js";
export const userIsAdmin = (app) => async (request, reply) => {

    if(request.headers['isadmin'] == 'true')
        return;
    else
        throw new UNAUTHORIZED_PERSONNEL();
}