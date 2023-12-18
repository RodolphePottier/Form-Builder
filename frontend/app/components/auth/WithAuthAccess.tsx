'use client'
import React, { ComponentType, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const withAuthAccess = <P extends object>(WrappedComponent: ComponentType<P>): React.FC<P> => {
	const ComponentWithAuth: React.FC<P> = (props) => {
		const router = useRouter();
		const { isAuthenticated } = useAuth();

		useEffect(() => {
			if (!isAuthenticated) {
				router.replace('/auth');
			}
		}, [isAuthenticated, router]);

		return isAuthenticated ? <WrappedComponent {...props} /> : null;
	};

	return ComponentWithAuth;
};

export default withAuthAccess;
