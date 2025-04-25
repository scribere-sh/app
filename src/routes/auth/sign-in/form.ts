import { type } from 'arktype';

export const schema = type({
	identifier: 'string.email | /^[a-z0-9.-]{3,30}$/',
	password: 'string'
});
