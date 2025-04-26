import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';

import { eq } from 'drizzle-orm';
import { or } from 'drizzle-orm';

import { setError, superValidate } from 'sveltekit-superforms';
import { arktype } from 'sveltekit-superforms/adapters';

import { type } from 'arktype';

import { db } from '$srv/db';
import { usersTable } from '$tb/user';
import { emailAddressesTable, emailLowerCase } from '$tb/email';
import { passwordsTable } from '$tb/auth';

import { verifyArgon2 } from '$srv/auth/argon2';
import { signJWT } from '$srv/auth/jwt';
import { setSecureToken, TOKEN_COOKIE_NAME } from '$srv/auth/cookie';

import { route } from '$lib/routes';

const SIX_DAYS_IN_SECONDS = 6 * 24 * 60 * 60;

const schema = type({
	identifier: 'string.email | /^[a-z0-9.-]{3,30}$/',
	password: 'string'
});

const defaults: typeof schema.infer = {
	identifier: '',
	password: ''
};

export const load = (async () => {
	const form = await superValidate(arktype(schema, { defaults }));

	return { form };
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, arktype(schema, { defaults }));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { 0: query, length } = await db
			.select({
				userId: usersTable.id,
				handle: usersTable.handle,
				displayName: usersTable.displayName,
				passwordHash: passwordsTable.hash
			})
			.from(usersTable)
			.leftJoin(emailAddressesTable, eq(usersTable.id, emailAddressesTable.userId))
			.innerJoin(passwordsTable, eq(usersTable.id, passwordsTable.userId))
			.where(
				or(
					eq(
						emailLowerCase(emailAddressesTable.email),
						form.data.identifier.toLowerCase()
					),
					eq(usersTable.handle, form.data.identifier)
				)
			)
			// allows us to detect if multiple users were matched
			// should be impossible but is worth checking
			.limit(2);

		if (length > 1) {
			// 2 users were found
			console.error('an identifier has found multiple user ids');
			return setError(form, 'identifier', 'multiple users found', { status: 500 });
		}

		if (length === 0) {
			console.error('an identifier does not correlate to any user');
			return setError(form, 'identifier', 'no user found', { status: 404 });
		}

		if (!(await verifyArgon2(query.passwordHash, form.data.password))) {
			// an invalid password was supplied
			return setError(form, 'password', 'invalid password', { status: 403 });
		}

		// from here:
		// - user id is found
		// - password is correct
		// we can now give the user a token

		const now = new Date();
		const now_s = now.getTime() / 1000;

		const expiry_s = now_s + SIX_DAYS_IN_SECONDS;

		const signedJwt = await signJWT({
			sub: query.userId,
			dis: query.displayName,
			han: query.handle,

			iss: 'app.scribere.sh',

			exp: expiry_s,
			iat: now_s,
			// clock skew account
			nbf: now_s - 60
		});

		const expiryDate = new Date(expiry_s * 1000);

		setSecureToken(TOKEN_COOKIE_NAME, signedJwt, expiryDate);

		return redirect(303, route('/'));
	}
};
