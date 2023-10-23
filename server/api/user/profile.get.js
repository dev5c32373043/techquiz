import { userAuth } from '~/server/middlewares';

export default defineEventHandler(userAuth(({ context: { currentUser } }) => currentUser));
