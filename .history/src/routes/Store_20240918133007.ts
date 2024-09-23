import { writable } from 'svelte/store'

let rangeStore = writable(
    {
        course: 13, //13
        start: 86, //70
        end: 106, //90
        selected_start: 86, //70
        selected_end: 150, //90
        selected_visit: 0, //70
        selected_watch: 0, //90
        selected: false,
        show: true,
        rerender: true,
        reheader: true,
        all: function () {
            let value = [];
            for (let i = this.start; i<=this.end; i++){
                value.push(i);
            }
            return value;
        },
        array: function (array: any[]) {
            let result = [];
            for (let i = this.start; i<=this.end; i++){
                result.push(makeEntry(array,i));
            }
            return result;
        },
        sum: function (input: any[], key: string, active: string){
            let returnvalue = 0;
            Object.entries(input).forEach((value)=>{
               returnvalue += value[1][key]*value[1]['b_'+active]*value[1]['parent_'+active];
            });
            return returnvalue;
        },
        max: function (input: any[], key: string){
            let returnvalue = 0;
            Object.entries(input).forEach((value)=>{
                if (value[1][key] && (value[1]['n_'+key.substring(2)] || key=='b_self') && value[1]['parent_'+key.substring(2)]&& parseInt(value[0])>returnvalue){
                    returnvalue = parseInt(value[0]);
                }
            });
            return returnvalue;
        },
        min: function (input: any[], key: string){
            let returnvalue = 99999;
            Object.entries(input).forEach((value)=>{ 
                    if (value[1][key]  && (value[1]['n_'+key.substring(2)] || key=='b_self') && value[1]['parent_'+key.substring(2)]&& parseInt(value[0])<returnvalue){
                        returnvalue = parseInt(value[0]);
                    } 
            });
            return returnvalue;
        },
        week_start: function (week: number) {
            return new Intl.DateTimeFormat('de-CH').format(new Date(Date.parse('2023-01-02') + (week-1)*7*24*3600*1000));
        },
        week_end: function (week: number) {
            return new Intl.DateTimeFormat('de-CH').format(new Date(Date.parse('2023-01-02') + (week-1)*7*24*3600*1000 + 6*24*3600*1000));
        },
        key: 0,
        infcount: function (week: number){
            /*while(input>=100){
                input-=100;
            }
            return input;*/
            let date = new Date(Date.parse('2023-01-02') + (week-1)*7*24*3600*1000)
            return ( ''+date.getDate()+'\n.'+(date.getMonth()+1));
        },
        header: {
            start: '',
            end: '',
            price: '',
        },
        text1: '',
        text2: '',
        invoice_text: '',
    }
);

export default rangeStore;


type NewType = any[];

	/**
	* 
   	* @param {number} day = the day a booked entry is looked for in array
	* @param {object} array = the array of all booked entries for the subject
	* returns the booked entry if it is found or an empty booked instance
   	*/
       function makeEntry(array: NewType, day: number){
		let result = {vistit: false, watch: false, portal: false, subject: {id: 1 /*hier subject id einfügen*/}};
		let keys=Object.keys(array);
		keys.forEach((key) => {
            // @ts-ignore
			if (array[key].day == day){
                // @ts-ignore
				result = array[key];
			}
		});
		return result;
	};