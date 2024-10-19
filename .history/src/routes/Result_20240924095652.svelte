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


	let weeks = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`week`)
			return response.json()
		}
	)()

	function setWeeks(weeks){
		range.weeks=[];
		weeks.forEach((element) => {
			range.weeks[element.week] = element;
		});
		range.dates.forEach((element) => {
			if (parseInt(element.exit)==0){
				range.weeks[element.week].entry = element.name;
			}
			else{
				range.weeks[element.week].exit = element.name;
			}
		});
		//console.log(range.weeks);
	}

	function startdate (input){
		if (typeof input.global !== 'undefined'){
			if (typeof input.global.start_all !== 'undefined'){
				return input.global.start_all;
			}
		}
		return "";
	}

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
		range.invoice_text='';
	}

</script>

<svelte:window on:keydown={onKeyDown} on:keyup|preventDefault={onKeyUp} />



	{#await courses}
		<p>Lade Kurs {range.course}... Bitte warten...</p>
	{:then courses}
	{#await weeks}
		<p>Lade Kurs Wochen...</p>
	{:then weeks}
		{setWeeks(weeks.data.week)}
		<img class="logo" src={logo} alt="EXAMPREP"/>
			<input style="margin-top: 10px" class="title" type="text" value="Vorbereitungskurs für die {courses.data.course[0].name}"><br/>
			Kursdauer: {range.week_start(range.selected_start)} bis {range.week_end(range.selected_end)}<br/>
			<!--Kursumfang: 
			{#if range.selected_visit == range.selected_watch}
				{range.selected_visit} Lektionen <br/><br/>
			{:else}
				{range.selected_visit} Lektionen und {range.selected_watch} Aufzeichnungen.<br/>
			{/if}-->
			<br/>
			<textarea class="desc" id="w3review" name="w3review" rows="4" cols="50">
Dieser Kurs bereitet Sie für die {courses.data.course[0].name} vor. 
Die enthaltenen Fächer sowie deren Anzahl Lektionen und Aufzeichnungen können Sie der nachfolgenden Tabelle entnehmen. 
Bei allen Fächern ist der Zugang zum Lernsystem mit allen Lernunterlagen und Aufzeichnungen inbegriffen.
			</textarea>
			
		{#key range.rerender}
			<header>
				<div class=sticky>
					<button onClick="window.print()">Drucken</button> 
					Woche: <b>{range.header.start} - {range.header.end}</b> <span class="red">//</span>
					Preis: <b>{range.header.price}</b> <span class="red">//</span>
					Stundenplan: {range.header.planname} <span class="red">//</span>
					CTRL: Auswählen <span class="red">//</span> OPTION: Abwählen <span class="red">//</span>
					{range.header.exitname}{range.header.entryname} <span class="red">//</span>
					<input class="no-print" type="checkbox" bind:checked={range.show}/>Details
				</div>
				<div class="upper-space"></div>
			</header>
			<Table {courses}/>
		{/key}
		
	{:catch error}
		<p>{error}</p>
	{/await}
	{/await}

<style>

	*{font-family: 'Roboto', Tahoma, Arial;}
	.upper-space {height: 50px;}

	.red{
		color: red;
	}
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

	textarea{
			resize: none;
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

</style>
