import type { Actions } from './$types';

import { superValidate, fail, setError } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

import { type } from 'arktype';

import { initCsrf, validateCsrf } from '$srv/csrf';

import { eq } from 'drizzle-orm';

import { db } from '$srv/db';
import { emailAddressesTable, emailLowerCase } from '$tb/email';

const schema = type({
	email: 'string.email',
	csrf: 'string'
});

const defaults: typeof schema.infer = {
	email: '',
	csrf: ''
};

export const load = async () => {
	const form = await superValidate(arktype(schema, { defaults }));
	const csrf = initCsrf();

	return { form, csrf };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, arktype(schema, { defaults }));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (!validateCsrf(form.data.csrf)) {
			return fail(400, { form, message: 'CSRF Error' });
		}

		const { length: emailAddressFoundCount } = await db
			.select({
				email: emailAddressesTable.email
			})
			.from(emailAddressesTable)
			.where(eq(emailLowerCase(emailAddressesTable.email), form.data.email.toLowerCase()))
			.limit(1);

		if (emailAddressFoundCount > 0) {
			return setError(form, 'email', 'email already exists', { status: 400 });
		}

		return setError(form, 'email', 'well fuck you', { status: 400 });

		// cleanupCsrf();
	}
};
