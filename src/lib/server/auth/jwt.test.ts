import { describe, expect, test } from 'vitest';

import { signJWT, verifyJWT } from './jwt';

describe('JWTs', () => {
	// in dev this should fetch from env vars

	test('sign a JWT in dev from local vars and verify it', async () => {
		// @ts-expect-error this is an invalid JWT, but that's fine for this test
		const jwt = await signJWT({ sub: 'yomama' });
		const body = await verifyJWT(jwt);

		// console.log({
		//     jwt,
		//     body
		// })

		// null means the key is invalid
		expect(body).not.toBeNull();
	});

	test('invalid syntax causes thrown error', async () => {
		await expect(verifyJWT('test invalid JWT')).rejects.toThrowError();
	});

	test('valid syntax with invalid jwt causes error', async () => {
		await expect(verifyJWT('shjkdhdl.dfsdafas.asdfasdfasdf')).rejects.toThrowError();
	});
});
