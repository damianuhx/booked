<script>
// @ts-nocheck

	import Result from './Result.svelte';
	import Row from './Row.svelte';
	import Table from './Table.svelte';
	// @ts-ignore
	import { onMount } from 'svelte';
	import rangeStore from './Store';
	import logo from '$lib/images/examprep.png';

	let range;
	let url = 'https://api2.excards.ch/';
	//let rerender = true;

	rangeStore.subscribe((data)=>{
		range = data;
	});

	let course_select = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`course`)
			return response.json()
		}
	)()

	let dates = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`date`)
			return response.json()
		}
	)()

	let weeks = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`week`)
			return response.json()
		}
	)()


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="KV3" />
</svelte:head>

{#if !range.selected}
	{#await course_select}
	<p>Bitte warten...</p>
	{:then course_select}
	{range.course}: {range.start} - {range.end}
	Kurs: 
	<select bind:value={range.course}>
		{#each course_select.data.course as option}
		<option value="{parseInt(option.id)}">{option.name}</option>
		{/each}
	</select>
	<br/>
		{#await dates}
		<p>Bitte warten...</p>
		{:then dates}
		
			Startdatum: 
			<select  bind:value={range.start}>
			{#each dates.data.date as option}
				{#if !parseInt(option.exit)}
					<option value="{parseInt(option.week)}">{option.name} | ab {range.week_start(option.week)} ({option.week})</option>
				{/if}
			{/each}
		</select>
		<br/>
		Enddatum:
		<select bind:value={range.end} name="cars" id="cars">
			{#each dates.data.date as option}
				{#if parseInt(option.exit)}
					<option value="{parseInt(option.week)}">{option.name} | bis {range.week_end(option.week)} ({option.week})</option>
				{/if}
			{/each}
		</select>
		<br/>
	  {#if range.course>0&&range.start>0 && range.end>0}
	  <button style="width: 300px;" on:click={()=>{if(range.course>0&&range.start>0 && range.end>0) {range.selected=true; range.rerender!=range.rerender;}}}>Anzeigen</button> 
	  {/if}
	  	{:catch error}
			<p>{error}</p>
		{/await}
{:catch error}
		<p>{error}</p>
	{/await}
{:else}
	<Result/>
{/if}

<style>

	*{font-family: 'Roboto', Tahoma, Arial;}
	.upper-space {height: 50px;}

	.logo{
		position:absolute;
		top: 0;
		right: 0;
		width: 200px;
	}

	.title{
		font-size: 24px;
		border-style: hidden;
	}

	.desc{
		border-style: hidden;
	}


	header {
		margin-top: -10px;
		margin-left: -10px;
		display: flex;
		justify-content: space-between;

	}

	.sticky{
		position: fixed;
		background-color: white;
		width: 100%;
		top: 0;
		left: 0;
	}

	@media print {
		.sticky{
			display: none;
		}
	}

	select{width: 300px;}
</style>
