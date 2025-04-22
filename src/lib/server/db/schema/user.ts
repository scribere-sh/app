import { ulid } from '$srv/ulid';

import {
	sqliteTable,
	// integer,
	text
	// blob
} from 'drizzle-orm/sqlite-core';

export const userTable = sqliteTable('users', {
	id: text({ mode: 'text' })
		.primaryKey()
		.$defaultFn(() => ulid().toCanonical())
});
