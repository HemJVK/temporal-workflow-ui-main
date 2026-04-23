export const setToken = (token: string) => localStorage.setItem('auth_token', token);
export const getToken = () => localStorage.getItem('auth_token');
export const removeToken = () => localStorage.removeItem('auth_token');

export const setAuthUser = (user: unknown) => localStorage.setItem('auth_user', JSON.stringify(user));
export const getAuthUser = () => {
    const user = localStorage.getItem('auth_user');
    return user ? JSON.parse(user) : null;
};
export const removeAuthUser = () => localStorage.removeItem('auth_user');

export const logout = () => {
    removeToken();
    removeAuthUser();
    window.location.href = '/login';
};

export const isAuthenticated = () => !!getToken();
