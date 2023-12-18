import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SnackbarProvider } from '@/app/components/snackbar/snackbar'
import Header from './components/layouts/Header'
import { AuthProvider } from './context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Form manager',
	description: 'Create Contart Form',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<AuthProvider>
				<SnackbarProvider>
					<body className={inter.className}>
						<Header />
						{children}
					</body>
				</SnackbarProvider>
			</AuthProvider>
		</html>
	)
}
