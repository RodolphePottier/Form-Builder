'use client'
import React, { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const withUnauthenticatedAccess = <P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> => {
	const ComponentWithUnauthenticatedAccess: React.FC<P> = (props) => {
		const router = useRouter();
		const { isAuthenticated } = useAuth();

		useEffect(() => {
			if (isAuthenticated) {
				router.replace('/');
			}
		}, [isAuthenticated, router]);

		return !isAuthenticated ? <WrappedComponent {...props} /> : null;
	};

	return ComponentWithUnauthenticatedAccess;
};

export default withUnauthenticatedAccess;
