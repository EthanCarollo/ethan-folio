<script>
export default{
    props:[
        "error"
    ],
    methods:{
      handleError(){
        clearError({ redirect: '/' })
      }
    }
}
</script>

<template>
    <tetikus :lerp="0.2" color="white" :showDefaultCursor = false :borderWidth="0" :size="28" :invertColor=true />
    <tetikus :lerp="0.4 " color="white" :showDefaultCursor = false :borderWidth="0" :size="18"/>

    <div class ="bg-slate-800 h-screen w-screen absolute top-0 left-0"></div>
    <div class="wrapper z-0">
        <div class="wave"></div>
    </div>
    <div class="wrapper z-0">
        <div class="wave second"></div>
    </div>
    
  <div class="h-screen w-screen flex justify-center flex-col items-center z-10 relative">
    <h1 class="text-9xl text-white">{{ error.statusCode }}</h1>
    <h1 class="text-lg text-white mb-5">oops... la page que vous cherchez n'existe pas.</h1>
    <div @click="handleError" class="text-xl text-slate-800 bg-white p-6 pt-3 pb-3">retourner a l'accueil</div>
  </div>
</template>

<style>

h1, div{
  font-family: "LiveMono";
}

.wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(to top, #accbee00 0%, #e7f0fd00 100%);
  overflow: hidden;
  z-index: 1;
}

.wave {
  width: 200vw;
  height: 202vw;
  position: absolute;
  top: -1%;
  left: 50%;
  margin-left: -100vw;
  margin-top: 50vw;
  border-radius: 35%;
  background: rgba(255, 255, 255, .75);
  animation: wave 23s infinite linear;
}

.second{
  background: rgba(255, 94, 94, 0.75);
  animation: wave 15s infinite linear;
}
.third{
  top: -10%;
  background: rgba(94, 183, 255, 0.75);
  animation: wave 17s infinite linear;
}

@keyframes wave {
  from { transform: rotate(0deg);}
  from { transform: rotate(360deg);}
}

</style>