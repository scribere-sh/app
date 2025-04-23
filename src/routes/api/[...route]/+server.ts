import type { RequestHandler } from './$types';

import { apiHandler } from '$srv/api';

export const GET: RequestHandler = ({ request }) => apiHandler.handle(request)
export const PUT: RequestHandler = ({ request }) => apiHandler.handle(request)
export const POST: RequestHandler = ({ request }) => apiHandler.handle(request)
export const DELETE: RequestHandler = ({ request }) => apiHandler.handle(request)