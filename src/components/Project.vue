<script>
import Icon from './Icon.vue';

export default{
    components:{
    Icon
},
    props:[
        "project"
    ]
}
</script>

<template>
    <div class ="relative bg-white min-h-[16vw] bg-cover bg-center projectclasshov shadow-lg shadow-black/30" :class="[this.project.colSpan, this.project.rowSpan]"
    v-bind:style="{ backgroundImage: 'url('+this.project.image+')' }">
        <div class="absolute top-0 left-0 w-full h-full bg-black/50 hover_project_class flex flex-col items-center">
            <h1 class="text-white text-lg p-3">{{ this.project.title }}</h1>
            <h1 class="text-white absolute top-0 right-0 p-3">{{ this.project.date }}</h1>
            <div class ="absolute bottom-0 left-0 w-full flex p-2 h-12 gap-3 fill-white">
                <Icon v-for="icon in project.icons" :icon="icon"></Icon>
            </div>
            <div class ="absolute bottom-0 right-0 w-full flex justify-end p-2 h-12 gap-3 fill-white">
                <Icon v-if="this.project.githubLink !== ''" icon="github"></Icon>
            </div>
        </div>
    </div>

</template>

<style scoped>
.projectclasshov{
    font-family: "LiveMono";
}

.hover_project_class{
    opacity: 0%;
    transition: all 1s;
}

.projectclasshov:hover .hover_project_class{
    opacity: 100%;
    transition: all 1s;
}
</style>