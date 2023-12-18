<script>

export default{
    props:[
        "project"
    ],
    methods:{
        mooveMouseProject(e){
            let card = document.querySelector("."+this.project.id+"inner");
            let outer_card = document.querySelector("."+this.project.id);
            let position_in = outer_card.getBoundingClientRect();
            let startY = position_in.y
            let centerY = startY + position_in.height /2
            let rotateY = (centerY - e.y ) / (position_in.height/9)

            let startX = position_in.x
            let centerX = startX + position_in.width /2
            let rotateX = -((centerX - e.x) / (position_in.width/12))

            //card.style.transform = `perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;
            card.style.transform = `rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;

        },
        leaveProject(e){
            let card = document.querySelector("."+this.project.id+"inner");
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    }
}
</script>

<template>
    <NuxtLink @mousemove="this.mooveMouseProject" @mouseleave="this.leaveProject" :to="'project/'+this.project.id" v-thover="{ scale: 0.5 }" class ="relative lg:min-h-[16vw] min-h-[16vh] project_card" 
    :class="[this.project.colSpan, this.project.rowSpan, this.project.id]">
        <div class="w-full h-full bg-cover bg-center project_card_inner shadow-lg shadow-black/30" :class="[this.project.id + 'inner']" v-bind:style="{ backgroundImage: 'url('+this.project.image+')' }">
            <div class="absolute top-0 left-0 w-full h-full bg-black/50 hover_project_class lg:opacity-0 flex flex-col items-center">
                <h1 class="text-white absolute text-left top-0 left-0 w-[70%] text-lg p-3">{{ this.project.title }}</h1>
                <h1 class="text-white absolute top-0 right-0 p-3">{{ this.project.date }}</h1>
                <div class ="absolute bottom-0 left-0 w-full flex p-2 h-12 gap-3 fill-white">
                    <Icon v-for="icon in project.icons" :icon="icon"></Icon>
                </div>
                <div class ="absolute bottom-0 right-0 w-full flex justify-end p-2 h-12 gap-3 fill-white stroke-white">
                    <h1 class="bg-white pl-4 pr-4 p-1">{{ this.project.tag }}</h1>
                </div>
            </div>
        </div>
    </NuxtLink>

</template>

<style scoped>


.project_card{
    perspective: 1000px;
    font-family: "LiveMono";
}

.hover_project_class{
    transition: all 1s;
}

.project_card:hover{
  perspective: 1000px;
  transform-style: preserve-3d;
}

.project_card .project_card_inner{
  transform: rotateY(0deg);
  transition: all 1s;
}

.project_card:hover .project_card_inner{
  transition: all 0.05s;
}


.project_card:hover .project_card_inner .hover_project_class{
    opacity: 100%;
    transition: all 1s;
}
</style>