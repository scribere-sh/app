// dumb cjs bs
import id128 from 'id128';
const { Ulid } = id128;

/**
 * Call {@link Ulid.toCanonical | `toCanonical` } on the returned ULID to
 * convert it to a string.
 */
export const ulid = Ulid.generate;
