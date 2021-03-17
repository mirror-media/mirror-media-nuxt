const CERTIFICATE_FETCH_FAILED =
  'Failed to fetch public key certificates required to verify a JWT (ID token or session cookie).'
const EXPIRED_ID_TOKEN = 'GraphQL error: ID token has expired'
const INVALID_ID_TOKEN = 'GraphQL error: failed to verify token signature'
const REVOKED_ID_TOKEN = 'revoked' /* Not yet test this varify(Todo) */
const USER_NOT_FOUND = 'no user exists with the uid:'

export {
  CERTIFICATE_FETCH_FAILED,
  EXPIRED_ID_TOKEN,
  INVALID_ID_TOKEN,
  REVOKED_ID_TOKEN,
  USER_NOT_FOUND,
}
