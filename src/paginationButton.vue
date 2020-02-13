<template>
    <li :class="{disabled: disabled, active: current===index}">
        <span :class="{current: current===index}" v-if="current===index || disabled" v-text="index + 1"></span>
        <a :href="prefix ? prefix+(index+1) : 'javascript:void(0)'" v-if="current!==index && !disabled" class="page-link" v-text="index + 1" @click="selectPage(index)"></a>
    </li>
</template>

<script>
    export default {
    	props:['index', 'current', 'disabled', 'prefix'],

        methods:{
    		selectPage() {
    			this.$emit('select-page',this.index);
            }
        }
    }
</script>