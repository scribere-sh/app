import { describe, expect, test } from 'vitest';

import { getCurrentSigningKID, getSigningKey, uint8ArrayStrictEqual } from './key';

describe('Key and Signature comparison', () => {
	test('empty arrays equal', () => {
		const a = new Uint8Array();
		const b = new Uint8Array();

		expect(uint8ArrayStrictEqual(a, b)).toEqual(true);
	});

	test('non-empty arrays equal', () => {
		const a = new Uint8Array([0, 1, 2]);
		const b = new Uint8Array([0, 1, 2]);

		expect(uint8ArrayStrictEqual(a, b)).toEqual(true);
	});

	test('non-empty different arrays should not be equal', () => {
		const a = new Uint8Array([0, 1, 2]);
		const b = new Uint8Array([0, 1, 3]);

		expect(uint8ArrayStrictEqual(a, b)).toEqual(false);
	});
});

describe('verify env', () => {
	test('getting signing key from dev environment', async () => {
		const signingKid = await getCurrentSigningKID();

		expect(signingKid).not.toBeNull();

		const signingKey = await getSigningKey(signingKid);

		expect(signingKey).not.toBeNull();

		// if (signingKey) console.debug({
		//     signingKid,
		//     signingKeyb64: Buffer.from(signingKey).toString('base64')
		// });
	});
});
