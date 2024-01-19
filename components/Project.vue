<script>

export default{
    props:[
        "project"
    ],
    methods:{
        mooveMouseProject(e){
            let card = document.querySelector("."+this.project.id+"inner");
            let cardBorder = document.querySelector("."+this.project.id+"border");
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
            cardBorder.style.transform = `rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`;

        },
        leaveProject(e){
            let card = document.querySelector("."+this.project.id+"inner");
          let cardBorder = document.querySelector("."+this.project.id+"border");
          card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          cardBorder.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        }
    }
}
</script>

<template>
    <NuxtLink @mousemove="this.mooveMouseProject" @mouseleave="this.leaveProject" :to="'project/'+this.project.id" v-thover="{ scale: 0.5 }" class ="relative lg:min-h-[16vw] min-h-[16vh] project_card" 
    :class="[this.project.colSpan, this.project.rowSpan, this.project.id]">
      <div class ="gradient-border absolute top-0 left-0 w-full h-full" :class="[this.project.id + 'border']"></div>
        <div class="w-full h-full absolute top-0 left-0 bg-cover bg-center project_card_inner shadow-lg shadow-black/30" :class="[this.project.id + 'inner']" v-bind:style="{ backgroundImage: 'url('+this.project.image+')' }">
            <div class="absolute top-0 left-0 w-full h-full bg-black/50 hover_project_class lg:opacity-0 flex flex-col items-center">
                <h1 class="text-white absolute text-left top-0 left-0 w-[70%] text-lg lg:text-xl p-3">{{ this.project.title }}</h1>
                <h1 class="text-white absolute top-0 right-0 lg:text-xl p-3">{{ this.project.date }}</h1>
                <div class ="absolute bottom-0 left-0 w-full flex p-2 h-12 lg:h-14 gap-3 fill-white">
                    <Icon v-for="icon in project.icons" :icon="icon"></Icon>
                </div>
                <div class ="absolute bottom-1 right-0 w-full flex justify-end p-2 h-12 gap-3 fill-white stroke-white">
                    <h1 class="bg-white pl-4 pr-4 lg:pb-8 lg:text-xl p-1">{{ this.project.tag }}</h1>
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

/**************/
/*******gradient border*******/
/**************/

.gradient-border {
  transition: all 1s;
  --border-width: 3px;

  position: relative;
  font-family: Lato, sans-serif;
  font-size: 2.5rem;
  text-transform: uppercase;
  color: white;
  background: #222;
  border-radius: var(--border-width);
}

.project_card .gradient-border{
  opacity: 0;
}

.project_card:hover .gradient-border{
  transition: all 0.05s;
  opacity: 90%;
}

.gradient-border:after{
  position: absolute;
  content: "";
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  z-index: -10;
  width: calc(100% + var(--border-width) * 2);
  height: calc(100% + var(--border-width) * 2);
  background: linear-gradient(
      60deg,
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(88 28 135),
      rgb(216 180 254),
      rgb(88 28 135),
      rgb(88 28 135)
  );
  background-size: 300% 300%;
  background-position: 0 50%;
  border-radius: calc(2 * var(--border-width));
  animation: moveGradient 4s alternate infinite;
}

@keyframes moveGradient {
  50% {
    background-position: 100% 50%;
  }
}

</style>