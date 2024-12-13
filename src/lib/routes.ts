/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const authRoutes = ['/auth'];

/**
 * An array of routes that are accessible to authenticated users
 * These routes require authentication
 * @type {string[]}
 */
export const appRoutes = ['/profile'];
