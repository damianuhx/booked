<script>
// @ts-nocheck

	import Row from './Row.svelte';
	import Table from './Table.svelte';
	// @ts-ignore
	import { onMount } from 'svelte';
	import rangeStore from './Store';
	import logo from '$lib/images/examprep.png';

	let range;
	let export_name='KV';
	rangeStore.subscribe((data)=>{
		range = data;
	});
	let url = range.url;
	let student_selected={};

	let courses = (
		async () => {
			let returnvalue={};
			// @ts-ignore
			if (typeof range.loaded_courses !== 'undefined'){
				returnvalue.data = {course: [range.loaded_courses.data]};
			}
			else{
				const response = await fetch(url+`all//`+range.course+`/`+range.start+`/`+range.end);
				returnvalue = response.json();
			}
			return returnvalue;
		}
	)();


	let weeks = (
		async () => {
			// @ts-ignore
			const response = await fetch(url+`week`)
			return response.json()
		}
	)();

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
		return '';
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

	let students = (
		async () => {
			// @ts-ignore
			const response = await fetch('https://admin.excards.ch/api/student.php');
			let data = await response.json();
			return data;
		}
	)()

	async function export2crm(){

		console.log(courses);
		let body= JSON.stringify(
			{
				token: '4Lq18hYEzpBrK1j9AOT',
				amount: range.export_price,
				product: export_name,
				comment: range.export_comment,
				comment2: range.export_comment2, //+ ' \n \n ' + range.invoice_text,
				student_id: student_selected,
				range: range.export2crm
			}
		);

		const response = await fetch(`https://admin.excards.ch/api/booked.php`,
                {
                    method: 'PUT',
                    body: body,
                }
            );

		const result = await response.json();
		
		range.invoice.id=await result.invoice_id;
		range.invoice.student_id=await result.student_id;
		range.invoice.name=await result.invoice_name;

		console.log(result);

		return result;
	}
	

	async function save2db () {
			// @ts-ignore
			let thiscourses;
			let thisweeks;

			weeks.then((value)=>{
				thisweeks=value.data;
				courses.then(async (value)=>{
					thiscourses=value.data;
					let body= JSON.stringify({
						data:  JSON.stringify(range),
						courses:  JSON.stringify(thiscourses),
						weeks:  JSON.stringify(thisweeks),
						student_id: 77,
						name: save.name,}
			);

			const response = await fetch(url+`save`,
                {
                    method: 'PUT',
                    body: body,
                }
            );

			const result = await response.json();
			return result;
			});
		});
		}
	//Saving
	let save = {
		name: 'test',
	};

	function save2courses(save_id, saves_array){
		//range=saves[save_id];
		for (const [key, value] of Object.entries(saves_array[save_id].data)) {
    		range[key]=value;
		}
	}
</script>

<svelte:window on:keydown={onKeyDown} on:keyup|preventDefault={onKeyUp} />

{#await students}
<p>Lade Studierende... Bitte warten...</p>
{:then students}

<div class="no-print" style="margin-top: 2rem">
	<input type="text" bind:value={export_name} />
	<select bind:value={student_selected}>
		{#each students as student, student_id}
		<option value="{parseInt(student.id)}">{student.firstname+' '+student.lastname}</option>
		{/each}
	</select>
	<button style="width: 30%" type="button" on:click={()=>{export2crm()}}>Exportieren</button> 
	{#if range.invoice.id>0}
		<a target="_blank" href="https://admin.excards.ch/invoices.php?id={range.invoice.student_id}#{range.invoice.id}">Rechnung #{range.invoice.id}: <b>{range.invoice.name}</b> S:{range.invoice.student_id}</a>
	{/if}
</div>

	{#await courses}
		<p>Lade Kurs {range.course}... Bitte warten...</p>
	{:then courses}
		{#await weeks}
			<p>Lade Kurs Wochen...</p>
		{:then weeks}
			{setWeeks(weeks.data.week)}
			<!-- Save Funktion (deaktiviert)
				<div style="margin-top: 2rem">
				<input style="width: 30%" bind:value={save.name} placeholder="enter your name" />
				<button style="width: 30%" type="button" on:click={()=>{save2db()}}>Speichern</button> 
			</div>-->

			<!--Exportfunktion-->



			<!---   -->

			

			<img class="logo" src={logo} alt="EXAMPREP"/>
				<input style="margin-top: 80px" class="title" type="text" value="Vorbereitungskurs für die {courses.data.course[0].name}"><br/>
				Kursdauer: {range.week_start(range.selected_start)} bis {range.week_end(range.selected_end)}<br/>
				<br/>
				<div style="display: none">{range.export_comment="Vorbereitungskurs für die "+courses.data.course[0].name+" mit Kursdauer von "+range.week_start(range.selected_start)+" bis "+range.week_end(range.selected_end)}</div>
				
				<textarea class="desc" id="w3review" name="w3review" rows="4" cols="50">
{range.export_comment2="Dieser Kurs bereitet Sie für die "+courses.data.course[0].name+" vor. \nDie enthaltenen Fächer sowie deren Anzahl Lektionen und Aufzeichnungen können Sie der nachfolgenden Tabelle entnehmen. \nBei allen Fächern ist der Zugang zum Lernsystem mit den Lernunterlagen inbegriffen.\n\n"}
				</textarea>
				
			{#key range.rerender}
				<header>
					<div class=sticky>
						<button style="font-weight: 700" onClick="window.print()">Drucken</button> <span class="red">//</span>
						Woche: <b>{range.header.start} - {range.header.end}</b> <span class="red">//</span>
						Preis: <b>{range.header.price}</b> <span class="red">//</span>
						Stundenplan: <b>{range.header.planname}</b> <span class="red">//</span>
						
						<b>{range.header.exitname} {range.header.entryname}</b> <span class="red">//</span>
						<input class="no-print" type="checkbox" bind:checked={range.show}/>Details <span class="red">//</span>
						<input class="no-print" type="checkbox" bind:checked={range.intern}/>Interne Preise <span class="red">//</span>
						<b>control:</b> Auswählen <span class="red">//</span> <b>option:</b> Abwählen <span class="red">//</span>
					</div>
					<div class="upper-space"></div>
				</header>
				<Table {courses}/>
			{/key}
			<br/><textarea class="desc" id="w3review" name="w3review" rows="6" cols="149">
Dieser Kostenvoranschlag wurde erstellt für ... und ist gültig bis zum {Intl.DateTimeFormat('de-CH').format(new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000))}.
Der Zugang zum Lernportal während den Prüfungen ist gewährleistet.
				</textarea>
				<br/>
		{:catch error}
			<p>{error}</p>
		{/await}
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
		.no-print{
			display: none
		}
		.sticky{
			display: none;
		}
	}

</style>
