<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/svelte-logo.svg';
	import github from '$lib/images/github.svg';
	import rangeStore from './Store';

	// @ts-ignore
	let range;

	rangeStore.subscribe((data)=>{
		range = data;
	});

</script>



<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.sticky{
		position: fixed;
		background-color: white;
		width: 100%;
	}

	@media print {
		.sticky{
			display: none;
		}
	}
</style>
