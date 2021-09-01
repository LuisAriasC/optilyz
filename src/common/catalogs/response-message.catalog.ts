export enum ResponseMessage {
    SUCCESS = 'Success',
    FAILURE = 'Failure during request',
    PENDING = 'Pending request.',
    UNAUTHORIZED = 'Unauthorized request.',
    MISSING_TOKEN = 'Missing access token on the request.',
    MISSING_REFRESH_TOKEN = 'Missing refresh token on the request.',
    TOKEN_EXPIRED = 'Token expired.',
    FORBIDDEN = 'Forbidden resource.',
    NOT_FOUND = 'Not found.',
}
