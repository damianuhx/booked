<script>
    // @ts-nocheck
    
        import Row from './Row.svelte';
        import { onMount } from 'svelte';
        import rangeStore from './Store';

        export let courses;
    </script>
    <div class="table">
        <Row bind:subject={courses.data.course[0]} layer={0} show=true parent_global={{visit: true, watch: true, self: true}}/>
     </div>


     <style>
        .table{
            width: 5000px;
        }
     </style>