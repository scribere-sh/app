import Action from './alert-dialog-action.svelte';
import Cancel from './alert-dialog-cancel.svelte';
import Content from './alert-dialog-content.svelte';
import Description from './alert-dialog-description.svelte';
import Footer from './alert-dialog-footer.svelte';
import Header from './alert-dialog-header.svelte';
import Overlay from './alert-dialog-overlay.svelte';
import Title from './alert-dialog-title.svelte';

import { AlertDialog as AlertDialogPrimitive } from 'bits-ui';

const Root = AlertDialogPrimitive.Root;
const Trigger = AlertDialogPrimitive.Trigger;
const Portal = AlertDialogPrimitive.Portal;

export {
	Root,
	Action,
	Cancel,
	Content,
	Trigger,
	Portal,
	Description,
	Footer,
	Header,
	Overlay,
	Title,
	//
	Root as AlertDialog,
	Action as AlertDialogAction,
	Cancel as AlertDialogCancel,
	Content as AlertDialogContent,
	Trigger as AlertDialogTrigger,
	Portal as AlertDialogPortal,
	Description as AlertDialogDescription,
	Footer as AlertDialogFooter,
	Header as AlertDialogHeader,
	Overlay as AlertDialogOverlay,
	Title as AlertDialogTitle
};
