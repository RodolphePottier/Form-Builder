import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface ConfirmDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	content: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm, title, content }) => {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{content}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={onClose}>Cancel</Button>
				<Button
					variant="contained"
					onClick={onConfirm}
					autoFocus
					style={{ backgroundColor: 'red', color: 'white' }}
				>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;