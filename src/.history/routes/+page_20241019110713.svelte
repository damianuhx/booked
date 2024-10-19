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

	let dates = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`date`)
			return response.json()
		}
	)()

</script>

<svelte:head>
	<title>Kurse</title>
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
{:else}
	<Result/>
{/if}


	
	
<footer class="only-printx" style="
width: 90%;
break-after: always;
position: relative !important; bottom: 0;
font-size: 0.7rem !important;
margin-right: 3rem !important
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


.lt {
        width: 140px; display: inline-block; min-width: 80px; margin-bottom: 10px !important;
    }
	.red {color: red}

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

	.only-print{
			display: none;
		}

	@media print {
		.sticky{
			display: none;
		}
		.only-print{
			display: block;
		}
	}

	select{width: 300px;}
</style>
