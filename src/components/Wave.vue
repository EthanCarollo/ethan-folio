<template>
    <div class="wrapper">
        <div class="wave"></div>
    </div>
    <div class="wrapper">
        <div class="wave second"></div>
    </div>
    <div class="wrapper">
        <div class="wave third"></div>
    </div>
</template>

<style scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-image: linear-gradient(to top, #accbee00 0%, #e7f0fd00 100%);
  overflow: hidden;
  z-index: -1;
}

.wave {
  width: 200vw;
  height: 202vw;
  position: absolute;
  top: -90%;
  left: 50%;
  margin-left: -100vw;
  margin-top: -100vw;
  border-radius: 35%;
  background: rgba(255, 255, 255, .75);
  animation: wave 23s infinite linear;
}

.second{
  background: rgba(255, 94, 94, 0.75);
  animation: wave 15s infinite linear;
}
.third{
  top: -100%;
  background: rgba(94, 183, 255, 0.75);
  animation: wave 17s infinite linear;
}

@keyframes wave {
  from { transform: rotate(0deg);}
  from { transform: rotate(360deg);}
}

</style>