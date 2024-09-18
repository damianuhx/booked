<script>
// @ts-nocheck

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

	let courses = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`all//`+range.course+`/`+range.start+`/`+range.end)
			return response.json()
		}
	)()

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

	function onKeyDown(e) {
		 switch(e.keyCode) {
			 case 17:
				range.key=17;
				 break;
			 case 18:
				range.key=18;
				 break;
		 }
	}

	function onKeyUp(e) {
		range.rerender=!range.rerender;
		range.key=0;
		range.invoice_text='jjj';
	}

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="KV3" />
</svelte:head>

<svelte:window on:keydown={onKeyDown} on:keyup|preventDefault={onKeyUp} />


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
	{#await courses}
		<p>Lade Kurse... Bitte warten...</p>
	{:then courses}
	<img class="logo" src={logo} alt="EXAMPREP"/>
			<input class="title" type="text" value="{courses.data.course[0].name}"><br/>
			<textarea class="desc" id="w3review" name="w3review" rows="4" cols="50"></textarea>
		{#key range.rerender}
			<header>
				<div class=sticky>
					<button onClick="window.print()">Drucken</button> 
					Woche: {range.header.start} - {range.header.end}
					Preis: {range.header.price}
					CTRL: Auswählen, OPTION: Abwählen
					<input class="no-print" type="checkbox" bind:checked={range.show}/>Details
				</div>
				<div class="upper-space"></div>
			</header>
			<Table {courses}/>
		{/key}
		<textarea class="desc" id="w3review" name="w3review" cols="50"></textarea>
	{:catch error}
		<p>{error}</p>
	{/await}
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
