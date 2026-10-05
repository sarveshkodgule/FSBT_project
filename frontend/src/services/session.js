// A stale or malformed saved session should never stop the app from loading.
export const readSavedUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('gamestore_user') || 'null');
    return user && typeof user === 'object' && typeof user.token === 'string'
      && typeof user.name === 'string' ? user : null;
  } catch {
    return null;
  }
};
