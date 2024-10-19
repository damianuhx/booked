<script>
// @ts-nocheck

	import Row from './Row.svelte';
	import { onMount } from 'svelte';
	import rangeStore from './Store';
	import visit from '$lib/images/visit.svg';
	import watch from '$lib/images/watch.svg';

	export let subject;
	export let layer;
	export let show;
	export let parent_global;

	let range;

	function bool2noprint(value){
		if (!value){return 'no-print';}
		else {return ''}
	}

	function bool2greyed(value){
		if (!value){return 'greyed';}
		else {return ''}
	}

	function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

	rangeStore.subscribe((data)=>{
		range = data;
	});

	function dateColor(week){
		if (typeof range.weeks[week].entry !== 'undefined'){
			return 'green';
		}
		else if (typeof range.weeks[week].exit !== 'undefined'){
			return 'darkred';
		}
		else{
			return 'black';
		}
	}

	function bool2active(bool){
		if (bool){
			return "selected"
		}
		else {
			return "unselected"
		}
	}

	function bool2parentactive(bool){
		if (bool){
			return ""
		}
		else {
			return "noparent"
		}
	}

	function change (input, change, week=0){
			if (range.key==17){
				if (change=='visit'){
					input.b_visit=true;
					input.b_watch=true;
				}
				else if (change == 'watch'){
					input.b_watch=true;
				}
				else if (change == 'self'){
					input.b_self=true;
				}
				else if (change == 'all'){
					input.b_visit=true;
					input.b_watch=true;
					input.b_self=true;
				}
			}
			if (range.key==18){
				if (change=='visit'){
					input.b_visit=false;
				}
				else if (change == 'watch'){
					input.b_watch=false;
					input.b_visit=false;
				}
				else if (change == 'self'){
					input.b_self=false;
				}
				else if (change == 'all'){
					input.b_visit=false;
					input.b_watch=false;
					input.b_self=false;
				}
			}
			
			if (change=='visit'){
				range.header.price=input.p_visit+input.p_watch;
			}
				else if (change == 'watch'){
					range.header.price=input.p_watch;
				}
				else if (change == 'self'){
					range.header.price=input.p_self;
				}
			range.rerender=!range.rerender;
			range.header.start=range.week_start(week);
			range.header.end=range.week_end(week);
			range.header.planname=range.weeks[week].plan.name;
			range.header.exitname=range.weeks[week].entry || '';
			range.header.entryname=range.weeks[week].exit || '';
			

			return input;
		}

function calc(subject) {
	//
}
	onMount(() => 
	{

		if (typeof subject.data == "undefined") {subject.data = {};}
		if (typeof subject.global == "undefined") {subject.global = {};}
		if (typeof subject.show == "undefined") {subject.show=show;}
		// prefix:
		// b_ = boolean = is the entry counted or not
		// n_ = number = the number of lessons in each week (for watch and visit)
		// p_ = price = price of the week (for self, ??? also for watch and visit?)


		//bool:active for 1.all, 2.visit, 3.watch, 4.self, only set if not already set
		if (typeof subject.global.all == "undefined") {
			if (typeof subject.selected !== 'undefined'){
				subject.global.all = Boolean(parseInt(subject.selected));
			}
			else{
				subject.global.all = true;
			}
		} //is the row active or not
		if (typeof subject.global.visit == "undefined") {subject.global.visit = true;} //is the visit/Präsenz part of the row active
		if (typeof subject.global.watch == "undefined") {subject.global.watch = true;} //is the watch/aufzeichnung  part of the row active
		if (typeof subject.global.self == "undefined") {subject.global.self = true;} //is the self study/Selbststudium part of the row active

		//set week data from grid or set 0 if no grid; if not already set
		range.all().forEach((index)=>{
			if (typeof subject.data[index] == 'undefined'){subject.data[index]={}};
			if (typeof subject.subject !== 'undefined' && typeof subject.subject.grid !== 'undefined'){
				//number of lessons
				if (typeof subject.data[index].n_visit == 'undefined'){subject.data[index].n_visit=subject.subject.grid[index] || 0;}
				if (typeof subject.data[index].n_watch == 'undefined'){subject.data[index].n_watch=subject.subject.grid[index] || 0;}
				//prices
				subject.data[index].p_self=(Math.round(parseFloat(subject.subject.price_base * 0.01 || 0) *100))/100 ;
				subject.data[index].p_visit=parseFloat(subject.subject.price_lesson * 0.5 * subject.data[index].n_visit  || 0) ;
				subject.data[index].p_watch=parseFloat(subject.subject.price_lesson * 0.5 * subject.data[index].n_watch  || 0) ;
			}
			else {
				subject.data[index].n_visit=0;
				subject.data[index].n_watch=0;
				subject.data[index].p_self=0
				subject.data[index].p_visit= 0;
				subject.data[index].p_watch= 0;
			}
		});

		//only set activeif not already set, 
		range.all().forEach((index)=>{	
				if (typeof subject.data[index].b_visit == "undefined") {subject.data[index].b_visit = true;}
				if (typeof subject.data[index].b_watch == "undefined") {subject.data[index].b_watch = true;}
				if (typeof subject.data[index].b_self == "undefined") {subject.data[index].b_self = true;}
				//if (subject.data[index].b_visit == true){subject.data[index].b_watch = true;}
				/*if (subject.data[index].b_watch == false){subject.data[index].b_visit = false;}*/
		});

		//set base price 
		if (typeof subject.global.b_base == 'undefined'){subject.global.b_base = true;}
		if (!subject.children.length){
			subject.global.p_base = parseFloat(subject.subject.price_base)*1.03; //3 wochen werden zusätzlich verrechnet, 6 geschenkt
		}
		else{
			subject.global.p_base = 0
		}
			
		
		//add values from all children
		subject.children.forEach((child)=>{
			range.all().forEach((index)=>{	
				//set parent active here: if this.parent_active && this.active
				if (layer==0){
					subject.data[index].parent_visit = true;
					subject.data[index].parent_watch = true;
					subject.data[index].parent_self = true;
				}
				child.data[index].parent_visit=subject.data[index].parent_visit && subject.data[index].b_visit;
				child.data[index].parent_watch=subject.data[index].parent_watch && subject.data[index].b_watch;
				child.data[index].parent_self=subject.data[index].parent_self && subject.data[index].b_self;

				subject.data[index].n_visit += child.data[index].n_visit*child.global.visit*child.global.all*child.data[index].b_visit;//*parent_global.visit;
				subject.data[index].n_watch += child.data[index].n_watch*child.global.watch*child.global.all*child.data[index].b_watch;//*parent_global.watch;
				subject.data[index].p_self += child.data[index].p_self*child.global.self*child.global.all*child.data[index].b_self;//*parent_global.self;
				subject.data[index].p_visit += child.data[index].p_visit*child.global.visit*child.global.all*child.data[index].b_visit;//*parent_global.visit; // add visit price for the week
				subject.data[index].p_watch += child.data[index].p_watch*child.global.watch*child.global.all*child.data[index].b_watch;//*parent_global.watch; // add watch price for the week
			});
			subject.global.p_base += parseFloat(child.global.p_base)*child.global.b_base*child.global.all; // add watch price for the week
		});
		

		//changable
		range.all().forEach((index)=>{	
			if (
				subject.data[index].n_visit > 0 
				|| 
				(typeof subject.subject !== 'undefined' 
				&& typeof subject.subject.grid !== 'undefined' 
				&& typeof subject.subject.grid[index] !== 'undefined' 
				&& subject.subject.grid[index]>0)
			)
			{
				subject.data[index].c_visit=true;
			}
			else{
				subject.data[index].c_visit=false;
			}
			if (
				subject.data[index].n_watch > 0 
				|| 
				(typeof subject.subject !== 'undefined' 
				&& typeof subject.subject.grid !== 'undefined' 
				&& typeof subject.subject.grid[index] !== 'undefined' 
				&& subject.subject.grid[index]>0)
			)
			{
				subject.data[index].c_watch=true;
			}
			else{
				subject.data[index].c_watch=false;
			}
		});
		//row calculations
		//add up:
		// lessons: watch, visit
		subject.global.n_watch = (parent_global.watch ? range.sum(subject.data, 'n_watch', 'watch') : 0) ;
		subject.global.n_visit = (parent_global.visit ? range.sum(subject.data, 'n_visit', 'visit') : 0) ;
		// prices: watch, visit, self, all
		subject.global.p_watch = (parent_global.watch ? range.sum(subject.data, 'p_watch', 'watch') : 0);
		subject.global.p_visit = (parent_global.visit ? range.sum(subject.data, 'p_visit', 'visit') : 0);
		subject.global.p_self = (parent_global.self ? range.sum(subject.data, 'p_self', 'self') : 0);
		subject.global.p_self += (parent_global.self ? subject.global.p_base * subject.global.b_base : 0);

		subject.global.p_all = subject.global.p_watch*subject.global.watch+subject.global.p_visit*subject.global.visit+subject.global.p_self*subject.global.self;
		// min/max week
		//console.log(subject);
		subject.global.start_visit = range.min(subject.data, 'b_visit');
		subject.global.end_visit = range.max(subject.data, 'b_visit');
		subject.global.start_watch = range.min(subject.data, 'b_watch');
		subject.global.end_watch = range.max(subject.data, 'b_watch');
		subject.global.start_self = range.min(subject.data, 'b_self');
		subject.global.end_self = range.max(subject.data, 'b_self')+6; //4 extrawochen im lernsystem
		if (subject.global.n_visit>0 || subject.global.n_watch>0){
			subject.global.start_all = Math.min(subject.global.start_visit, subject.global.start_watch);
			subject.global.end_all = Math.max(subject.global.end_visit, subject.global.end_watch);
		}
		else{
			subject.global.start_all = subject.global.start_self;
			subject.global.end_all = subject.global.end_self;
		}

		if (layer==0){
			range.selected_start=subject.global.start_all;
			range.selected_end=subject.global.end_all;
			range.selected_visit=subject.global.n_visit;
			range.selected_watch=subject.global.n_watch;
		}

		if (!subject.children.length){
			if (subject.global.n_visit+subject.global.n_watch>0 || subject.global.self && subject.global.p_self){
				range.invoice_text+= subject.name;
				
				if (subject.global.n_visit+subject.global.n_watch>0){
					range.invoice_text+=' Lektionen';
				}
				range.invoice_text+= ': ';
				if (subject.global.n_visit==subject.global.n_watch){
					range.invoice_text+=subject.global.n_visit+' ';
				}
				else{
					if (subject.global.n_visit>0){
						range.invoice_text+=subject.global.n_visit+' Präsenz ';
					}
					if (subject.global.n_visit>0 && subject.global.n_watch>0){
						range.invoice_text+=' & ';
					}
					if (subject.global.n_watch>0){
						range.invoice_text+=subject.global.n_watch+' Aufzeichnungen ';
					}
				}
				if (subject.global.n_visit+subject.global.n_watch>0){
					range.invoice_text+='('+range.week_start(subject.global.start_all)+' bis '+range.week_end(subject.global.end_all)+') '
				}
				
				if (subject.global.self  && subject.global.p_self){
					range.invoice_text+= 'Lernportal: '+range.week_start(subject.global.start_self)+' bis '+range.week_end(subject.global.end_self);
				}
				range.invoice_text+= '<span style="color: red"> // </span> <br/>';
			}
		
		}

	});
		
</script>

{#if typeof subject.global !== "undefined" && show}
<div class="subject {bool2noprint(subject.global.all)} {bool2noprint(subject.global.p_all)} {bool2greyed(subject.global.all)}" > <!--class noprint if deselected-->
	<div class="public-row title layer{layer}">
		{#if layer>0}
		<div aria-hidden=true class="name sum pad{layer}">
			<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.all}/>
			{capitalizeFirstLetter(subject.name)}
			{#if subject.children.length}
				<input class="no-print checkbox" type="checkbox" bind:checked={subject.show}>
			{/if}
		</div>
		<div class="sum-lesson sum">
			{#if !(subject.global.n_visit>0 && subject.global.visit)}
				{#if !(subject.global.n_watch>0 && subject.global.watch)}
					<div style="text-align: right;" class="sumpart">Selbststudium</div>
				{:else}
					<div class="sumpart {bool2noprint(subject.global.n_watch && !range.show)}"></div>
					<div class="sumpart {bool2noprint(subject.global.n_watch && !range.show)}">{subject.global.n_watch} <img class="icon" src={watch} alt=""/> </div>
				{/if}
			{:else}
				<div class="sumpart {bool2noprint(subject.global.n_visit && !range.show)}">{subject.global.n_visit}<img class="icon" src={visit} alt=""/> </div>
				<div class="sumpart {bool2noprint(subject.global.n_watch && !range.show)}">{subject.global.n_watch} <img class="icon" src={watch} alt=""/> </div>
			{/if}
		</div>
		<div class="start sum"> {range.week_start(subject.global.start_all)} </div> 
		<div class="start sum"> {range.week_end(subject.global.end_all)} </div>
		<div class="sum-price sum">	 {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_all)} </div>
		{:else}
		<div aria-hidden=true class="name sum pad1">
			Fach
		</div>
		<div style="text-align: center" class="sum-lesson sum">
			Lektionen
		</div>
		<div class="start sum"> Vom </div> 
		<div class="start sum"> Bis zum </div>
		<div style="text-align: center" class="sum-price sum">	 Preis </div>
		
		{/if}
	</div>

	

	{#if typeof subject.data !== "undefined"}
		<div class="square-row no-print">
		{#each Object.entries(subject.data) || [] as [week, value]}
				<div style="color: {dateColor(week)} !important; background-color: {range.weeks[week].plan.color} !important" aria-hidden=true on:mouseenter={()=>{value=change(value, 'all', week)}} class="square week" >{range.infcount(week)}</div>
		{/each}
		</div>
	{/if}
	{#if layer==0}
		<br/>
		<div class="hr" style=""></div>
	{/if}
	<!---->

	{#if range.show && subject.global.all}
		{#if  parent_global.visit}
		<br class="{bool2noprint(subject.global.visit && layer)}"/>
		<div class="public-row {bool2noprint(subject.global.visit && parent_global.visit && layer)} {bool2greyed(subject.global.visit)}" aria-hidden=true>
			<div class="name sum pad{layer}">
				<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.visit}>
				Schulbesuch
			</div>
			<div class="sum-lesson sum">{subject.global.n_visit} Lektionen </div>
			<div class="start sum"> {range.week_start(subject.global.start_visit)} </div> 
			<div class="start sum"> {range.week_end(subject.global.end_visit)} </div>
			<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_visit)} </div>
		</div>
		{#if typeof subject.data !== "undefined"}
			<div class="square-row no-print">
			{#each Object.entries(subject.data) || [] as [week, value]}
				<!-- if grid > 0 or n_visit > 0 or n_watch > 0-->
				{#if value.c_visit}
					<div aria-hidden=true class="square {bool2active(value.b_visit)} {bool2parentactive(value.parent_visit)}" on:mouseenter={()=>{value=change(value, 'visit', week)}}>{value.n_visit}</div>
				{:else}
					<div aria-hidden=true class="square idle" >{value.n_watch}</div>
				{/if}
			{/each}
			</div>
		{/if}
	{/if}

	{#if  parent_global.watch}
		<br class="{bool2noprint(subject.global.watch && layer)}"/>
		<div class="public-row {bool2noprint(subject.global.watch && layer)} {bool2greyed(subject.global.watch)}">
			
			<div class="name sum pad{layer}">
				<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.watch} > <!--on change funktioniert nicht wie erwartet-->
				Aufzeichnungen
			</div>
			
			<div class="sum-lesson sum">{subject.global.n_watch} Lektionen </div>
			<div class="start sum"> {range.week_start(subject.global.start_watch)} </div> 
			<div class="start sum"> {range.week_end(subject.global.end_watch)} </div>
			<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_watch)} </div>
		</div>
		{#if typeof subject.data !== "undefined"}
		<div class="square-row no-print">
			{#each Object.entries(subject.data) || [] as [week, value]}
				{#if value.c_visit}
					<div aria-hidden=true class="square {bool2active(value.b_watch)} {bool2parentactive(value.parent_watch)}" on:mouseenter={()=>{value=change(value, 'watch', week)}}>{value.n_watch}</div>
				{:else}
					<div aria-hidden=true class="square idle" >{value.n_watch}</div>
				{/if}
			{/each}
		</div>
		{/if}
	{/if}
		
	{#if  parent_global.self}
		{#if subject.global.p_self || subject.global.p_base} <!--wenn es ein selbststudium gibt-->
		<br class="{bool2noprint(subject.global.self && layer)}"/>
			<div class="public-row {bool2noprint(subject.global.self && layer)} {bool2greyed(subject.global.self)}">
				<div class="name sum pad{layer}">
					<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.self}>
					Lernportal
				</div>
				<div class="sum-lesson sum"> 
					
						<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.b_base}>
						
						<span class="no-print">Basis: {Math.round(subject.global.p_base * 100) / 100 }</span>
				</div>
				<div class="start sum"> {range.week_start(subject.global.start_self)} </div> 
				<div class="start sum"> {range.week_end(subject.global.end_self)} </div>
				<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_self)} </div>
			</div>
			{#if typeof subject.data !== "undefined"}
				<div class="square-row no-print">
				{#each Object.entries(subject.data) || [] as [week, value]}
					<!-- if grid > 0 or n_visit > 0 or n_watch > 0-->

						<div aria-hidden=true class="square {bool2active(value.b_self)} {bool2parentactive(value.parent_self)}" on:mouseenter={()=>{value=change(value, 'self', week)}}></div>
					
				{/each}
				</div>
			{/if}		
		{/if}
	{/if}
	{/if}
	</div>
{/if}


{#each subject.children as child}
	<Row subject={child} layer={layer+1} show={subject.show && show && subject.global.all} parent_global={{visit: parent_global.visit && subject.global && subject.global.visit, watch: parent_global.watch && subject.global && subject.global.watch, self: parent_global.self && subject.global && subject.global.self}} />	 
{/each}




<!--Duplicate from above-->
{#if typeof subject.global !== 'undefined' && layer==0 && range.show}
<div class="hr" style=""></div>

<div class="subject">
	{#if  parent_global.visit}
		<br class="{bool2noprint(subject.global.visit)}"/>
		<div class="public-row {bool2noprint(subject.global.visit && parent_global.visit)} {bool2greyed(subject.global.visit)}" aria-hidden=true>
			<div class="name sum title pad1">
				<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.visit}>
				Schulbesuch
			</div>
			<div class="sum-lesson sum">{subject.global.n_visit} Lektionen </div>
			<div class="start sum"> {range.week_start(subject.global.start_visit)} </div> 
			<div class="start sum"> {range.week_end(subject.global.end_visit)} </div>
			<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_visit)} </div>
		</div>
		{#if typeof subject.data !== "undefined"}
			<div class="square-row no-print">
			{#each Object.entries(subject.data) || [] as [week, value]}
				<!-- if grid > 0 or n_visit > 0 or n_watch > 0-->
				{#if value.c_visit}
					<div aria-hidden=true class="square {bool2active(value.b_visit)} {bool2parentactive(value.parent_visit)}" on:mouseenter={()=>{value=change(value, 'visit', week)}}>{value.n_visit}</div>
				{:else}
					<div aria-hidden=true class="square idle" >{value.n_watch}</div>
				{/if}
			{/each}
			</div>
		{/if}
	{/if}

	{#if  parent_global.watch}
		<br class="{bool2noprint(subject.global.watch)}"/>
		<div class="public-row {bool2noprint(subject.global.watch)} {bool2greyed(subject.global.watch)}">
			
			<div class="name sum title pad1">
				<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.watch} > <!--on change funktioniert nicht wie erwartet-->
				Aufzeichnungen
			</div>
			
			<div class="sum-lesson sum">{subject.global.n_watch} Lektionen </div>
			<div class="start sum"> {range.week_start(subject.global.start_watch)} </div> 
			<div class="start sum"> {range.week_end(subject.global.end_watch)} </div>
			<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_watch)} </div>
		</div>
		{#if typeof subject.data !== "undefined"}
		<div class="square-row no-print">
			{#each Object.entries(subject.data) || [] as [week, value]}
				{#if value.c_visit}
					<div aria-hidden=true class="square {bool2active(value.b_watch)} {bool2parentactive(value.parent_watch)}" on:mouseenter={()=>{value=change(value, 'watch', week)}}>{value.n_watch}</div>
				{:else}
					<div aria-hidden=true class="square idle" >{value.n_watch}</div>
				{/if}
			{/each}
		</div>
		{/if}
	{/if}
		
	{#if  parent_global.self}
		{#if subject.global.p_self || subject.global.p_base} <!--wenn es ein selbststudium gibt-->
		<br class="{bool2noprint(subject.global.self)}"/>
			<div class="public-row {bool2noprint(subject.global.self)} {bool2greyed(subject.global.self)}">
				<div class="name sum title pad1">
					<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.self}>
					Lernportal
				</div>
				<div class="sum-lesson sum"> 
					
						<input class="no-print checkbox" type="checkbox" bind:checked={subject.global.b_base}>
						
						<span class="no-print">Basis: {subject.global.p_base}</span>
				</div>
				<div class="start sum"> {range.week_start(subject.global.start_self)} </div> 
				<div class="start sum"> {range.week_end(subject.global.end_self)} </div>
				<div class="sum-price sum"> {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_self)} </div>
			</div>
			{#if typeof subject.data !== "undefined"}
				<div class="square-row no-print">
				{#each Object.entries(subject.data) || [] as [week, value]}
					<!-- if grid > 0 or n_visit > 0 or n_watch > 0-->

						<div aria-hidden=true class="square {bool2active(value.b_self)} {bool2parentactive(value.parent_self)}" on:mouseenter={()=>{value=change(value, 'self', week)}}></div>
					
				{/each}
				</div>
			{/if}		
		{/if}
	{/if}
</div>
{/if}
<!--END Duplicate-->




{#if layer==0 && typeof subject.global !== 'undefined'}
<div class="hr" style=""></div><br/>



<div class="public-row title">
	<div aria-hidden=true class="name sum pad1">
		Total
	</div>
	<div class="sum-lesson sum {bool2noprint(subject.global.show)}">
		{#if subject.global.n_visit>0 && subject.global.visit}
			<div class="sumpart">{subject.global.n_visit}<img class="icon" src={visit} alt=""/> </div>
		{/if}
		{#if subject.global.n_watch>0 && subject.global.watch}
			<div class="sumpart">{subject.global.n_watch} <img class="icon" src={watch} alt=""/> </div>
		{/if}
	</div>
	<div class="start sum"> {range.week_start(subject.global.start_all)} </div> 
	<div class="start sum"> {range.week_end(subject.global.end_all)} </div>
	<div class="sum-price sum">	 {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(subject.global.p_all)} </div>
	<br/><br/>
</div>

<div class="hr" style=""></div>
<div class="hr" style=""></div>
<br/>

<span class="no-print">{@html range.invoice_text.substring(0, range.invoice_text.length - 42)}</span>
{/if}




<style>
	*{font-family: 'Roboto', Tahoma, Arial;}
	.upper-space {height: 50px;}

		.desc{
		border-style: hidden;
		
	}

	.total{
		height: 50px;
	}
	.lessons{
		width: 2%;
	}
	.week{
		color: black !important;
		background-color: rgb(233, 233, 233) !important;
	}
	.idle{
		background-color: rgb(120, 120, 120) !important;
	}
	.selected.noparent{
		background-color: rgb(175, 167, 56) !important;
	}
	.selected{
		background-color: rgb(31, 92, 32) !important;
	}
	.unselected{
		background-color: rgb(154, 67, 67) !important;
	}

	.unselected.noparent{
		background-color: rgb(134, 97, 97) !important;
	}

	.subject{
		margin-bottom: 10px;
	}

	.hr{
		background-color: black; 
		print-color-adjust: exact;
		border-style: solid;
		border-width: 1px;
		height: 0px; 
		width: 925px;
		margin-bottom: -5px;
	}
	

	.square{
		font-size: 12px;
		text-align: right;
		color: white;
		background-color: blue;
		width: 15px;
		height: 15px;
		display: inline-block;
		margin: 1px;
	}

	.square-row{
		display: inline-block;
	}

	.public-row{
		display: inline-block;
	}

	.sum{
		display: inline-block;
		width: 120px;
	}

	.name{
		width: 360px;
	}

	.title{
		font-weight: bolder;
	}

	.sum-price{
		text-align: right;
		padding-right: 20px;
	}

	.pad0{
		padding-left: 0px;
		margin-right: 0px;
	}

	.pad1{
		margin-left: 20px;
		margin-right: -20px;
	}

	.pad2{
		padding-left: 40px;
		margin-right: -40px;
	}

	.pad3{
		padding-left: 60px;
		margin-right: -60px;
	}

	.pad4{
		padding-left: 80px;
		margin-right: -80px;
	}

	@media print {
		.no-print{
			display: none;
		}
		textarea{
			resize: none;
		}
	}

	.sum-lesson{
		width: 160px;
		padding-right: 20px;
		text-align: right;
		margin-bottom: -3px;
	}

	.sumpart{
		text-align: right;
    	width: 70px;
    	display: table-cell;
	}
	.icon{
		width: 20px;
    margin-bottom: -4px;
	}

	.checkbox{ margin: -3px;}

	.greyed{
		color: rgb(169, 169, 169)
	}


	@media print {
		.no-print{
			display: none;
		}

		.layer2{
			font-weight: 100;
		}

		.layer3{
			font-weight: 100;
			font-style: italic;
		}
	

	}
</style>

