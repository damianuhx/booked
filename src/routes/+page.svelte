<script>

	//Page: Select
	//Result: Load 
	//Table: Wrapper around table 
	//Row: Rows
// @ts-nocheck
	import Result from './Result.svelte';
	import Row from './Row.svelte';
	import Table from './Table.svelte';
	// @ts-ignore
	import { onMount } from 'svelte';
	import { serialize } from "cookie";
	import rangeStore from './Store';
	import logo from '$lib/images/examprep.png';
	import { page } from '$app/stores';

	let range;
	//let url = 'https://api2.excards.ch/';

	const url_para = $page.url;
	let student_id = url_para.searchParams.get('id');
	rangeStore.subscribe((data)=>{
		range = data;
	});
	let url = range.url;
	
	function setDates(dates){
		range.dates=dates.data.date;
	}

	let course_select = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`course`)
			return response.json()
		}
	)()


	let saves = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`save?id=`+student_id);
			let data = response.json();
			return data;
		}
	)()

	var saves_array=[];
	let save_selected={};

	function transform_saves(saves){
		let result=saves.data.save;
		
		let return_value=[];
		
		result.forEach((element) => {
			return_value.push({
				id: element.id,
				name: element.name,
				student_id: element.student_id,
				data: JSON.parse(element.data),
				courses: JSON.parse(element.courses),
				weeks: JSON.parse(element.weeks),
			});
		});
		return_value.forEach((element)=>{

		});
		console.log(return_value)
		return return_value;
	}

	function save2range(save_id, saves_array){
		for (const [key, value] of Object.entries(saves_array[save_id].data)) {
    		range[key]=value;
		}
		range.loaded_courses=saves_array[save_id];
		range.loaded_weeks=saves_array[save_id];
	}

	let dates = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`date`)
			return response.json()
		}
	)()
	
</script>


<!--*************************
html
*************************-->

<!-- header -->
<svelte:head>
	<title>Kurse</title>
	<meta name="description" content="KV3" />
</svelte:head>

<!-- if student is loaded -->
{#if student_id>0}
	{#await saves}
		<p>Bitte warten...</p>
	{:then saves}
		{saves_array=transform_saves(saves)}
		{#await saves_array}
			<p>Bitte warten...</p>
		{:then saves_array}
			<select bind:value={save_selected}>
				{#each saves_array as option, key}
				<option value="{parseInt(key)}">{option.name}</option>
				{/each}
			</select>
			<button style="width: 300px;" on:click={()=>{
				save2range(save_selected, saves_array); 
				range.selected=true; 
				range.rerender!=range.rerender;
			}}>Anzeigen</button> 
		{/await}
	{/await}
	{#if range.selected}
		<Result/>
	{/if}
<!-- create new KV -->
{:else}
	{#if !range.selected}
	<!-- select range & course -->
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
				{setDates(dates)}
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
	<!-- display matrix when everything is selected -->
	{:else}
		<Result/>
	{/if}
{/if}

	
<!--*************************
footer
*************************-->
<footer class="only-printx" style="
width: 600px;
position: relative !important; bottom: 0;
font-size: 0.7rem !important;
margin-right: 3rem !important;
padding: 10px;
border-style: ridge;
">
	<div style="width: 100%;font-size: 0.7rem !important;"> <div style="font-size: 0.7rem !important;margin-bottom: 0 !important" class="lt red">Schule:</div> ExamPrep <span class="red">//</span> Bändlistr. 31 <span class="red">//</span> 8064 Zürich </div>
	<div style="width: 100%;font-size: 0.7rem !important;"><div style="font-size: 0.7rem !important;margin-bottom: 0 !important" class="lt red">Verwaltung: </div> ExamPrep GmbH <span class="red">//</span> Parkweg 5 <span class="red">//</span> 8800 Thalwil <span class="red">//</span> info@examprep.ch </div>
	<div style="width: 100%;font-size: 0.7rem !important;"><div style="font-size: 0.7rem !important;margin-bottom: 0 !important" class="lt red">Kontakt: </div> Tel +41 44 720 06 67 <span class="red">//</span> info@examprep.ch <span class="red">//</span> www.examprep.ch </div>
	<div style="width: 100%;font-size: 0.7rem !important;"><div style="font-size: 0.7rem !important;margin-bottom: 0 !important" class="lt red">Bankverbindung: </div> ZKB (Zürcher Kantonalbank) <span class="red">//</span>  8010 Zürich <span class="red">//</span> IBAN: CH22 0070 0110 0026 2134 9 
	<div style="width: 100%;font-size: 0.7rem !important;"><div style="font-size: 0.7rem !important;margin-bottom: 0 !important" class="lt red"> </div> Swift: ZKBKCHZZ80A <span class="red">//</span> Bankenclearing (BC): 700 <span class="red">//</span>  Post-Konto: 80-151-4</div>
	<img style="margin: 10px;" src="https://pics.excards.ch/eduqua sw.png" height="30" alt="Verband Schweizerischer Privatschulen"/> <img style="margin: 10px;"  src="https://pics.excards.ch/vsp_logo.png" height="30" alt="Verband Schweizerischer Privatschulen"/>
</footer>



<style>
	.lt {width: 140px; display: inline-block; min-width: 80px; margin-bottom: 10px !important;}
	.red {color: red}
	select{width: 300px;}
</style>
