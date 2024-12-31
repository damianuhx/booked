import { writable } from 'svelte/store'

let rangeStore = writable(
    {
        url: 'http://localhost:8888/datian-api/', 
        urlx: 'https://api2.excards.ch/', 
        course: 13,
        start: 86,
        end: 106,
        selected_start: 86, 
        selected_end: 150,
        selected_visit: 0,
        selected_watch: 0,
        selected: false,
        show: true,
        intern: true,
        rerender: true,
        reheader: true,
        weeks: [],
        export2crm: [],
        all: function () {
            let value = [];
            for (let i = this.start; i<=this.end; i++){
                value.push(i);
            }
            return value;
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
            planname: '',
        },
        text1: '',
        text2: '',
        invoice_text: '',
    }
);

export default rangeStore;