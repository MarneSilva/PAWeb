import { UNAUTHORIZED_PERSONNEL } from "../../../libs/errors.js";
export const userIsAdmin = (app) => async (request, reply) => {

    if(request.headers['isadmin'] != 'true' || !request.headers['isadmin'])
        throw new UNAUTHORIZED_PERSONNEL();
    else
        return;
}