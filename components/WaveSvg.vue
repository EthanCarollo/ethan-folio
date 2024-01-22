<template>
  <div class="container">
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>
  </div>
</template>

<style scoped>

.container {
  position: absolute;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: "Nunito", sans-serif;
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: visible;
}

.blob {
  position: absolute;
  width: 50vw;
  height: 60vh;
  background: linear-gradient(
      180deg,
      rgba(47, 184, 255,0.42) 31.77%,
      #5c9df1 100%
  );
  mix-blend-mode: color-dodge;
  -webkit-animation: move 18s infinite alternate;
  animation: move 18s infinite alternate;
  transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);
}

.blob.blob-1 {
  width: 40vw;
  height: 50vh;
  background: linear-gradient(
      180deg,
      rgba(151, 47, 255, 0.42) 31.77%,
      #a45cf1 100%
  );
  -webkit-animation: move 12s infinite alternate;
  animation: move 12s infinite alternate;
  transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);
}

.blob.blob-3 {
  width: 43vw;
  height: 54vh;
  background: linear-gradient(
      180deg,
      rgba(255, 47, 47, 0.42) 31.77%,
      #f15c5c 100%
  );
  -webkit-animation: move-2 12s infinite alternate;
  animation: move-2 8s infinite alternate;
  transition: 1s cubic-bezier(0.07, 0.8, 0.16, 1);
}

.blob:hover {
  filter: blur(30px);
  box-shadow:
      inset 0 0 0 5px rgba(255,255,255, 0.2),
      inset 100px 100px 0 0px #fa709a,
      inset 200px 200px 0 0px #784ba8,
      inset 300px 300px 0 0px #2b86c5;
}

@keyframes move {
  from {
    transform: translate(-15vw, -5vh) rotate(-90deg);
    border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
  }

  to {
    transform: translate(30vw, 10vh) rotate(-10deg);
    border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
  }
}

@keyframes move-2 {
  to {
    transform: translate(-27vw, -5vh) rotate(-110deg);
    border-radius: 24% 76% 35% 65% / 27% 36% 64% 73%;
  }

  from {
    transform: translate(40vw, 10vh) rotate(-0deg);
    border-radius: 76% 24% 33% 67% / 68% 55% 45% 32%;
  }
}
</style>
<script setup lang="ts">
</script>