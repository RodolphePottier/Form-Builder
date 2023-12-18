'use client'

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface AuthContextType {
	isAuthenticated: boolean;
	signInContext: (token: string) => void;
	signOut: () => void;
}

interface AuthProviderProps {
	children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	signInContext: () => { },
	signOut: () => { },
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const router = useRouter();
	useEffect(() => {
		fetch(`http://localhost:3001/auth/verify-token/`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => {
				if (response.ok) {
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}
			})
			.catch((error) => {
				setIsAuthenticated(false);
			});
	}, []);

	const signInContext = (token: string) => {
		Cookies.set('access_token', token, { expires: 1 / 24 });
		setIsAuthenticated(true);
	};

	const signOut = () => {
		Cookies.remove('access_token');
		setIsAuthenticated(false);
		router.push('/');
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, signInContext, signOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
