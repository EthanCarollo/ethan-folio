<script setup>
import IconsJavascript from '~/components/icons/Javascript.vue';
import IconsUnity from '~/components/icons/Unity.vue';
import IconsHTML from '~/components/icons/HTML.vue';
import IconsCSS from '~/components/icons/CSS.vue';
import IconsP5 from '~/components/icons/P5.vue';
import IconsCS from '~/components/icons/CS.vue';
import IconsGithub from '~/components/icons/Github.vue';
import IconsGithubPage from '~/components/icons/GithubPage.vue';
import IconsVUE from '~/components/icons/VUE.vue';
import IconsPHP from '~/components/icons/PHP.vue';
import IconsMySQL from '~/components/icons/MySQL.vue';
import IconsElasticSearch from '~/components/icons/ElasticSearch.vue';
import IconsPsIcon from '~/components/icons/PsIcon.vue';
import IconsAsepriteIcon from '~/components/icons/AsepriteIcon.vue';
import IconsTailwindIcon from '~/components/icons/TailwindIcon.vue';
import IconsJetbrains from '~/components/icons/Jetbrains.vue';
import IconsMore from '~/components/icons/More.vue';
import IconsGit from '~/components/icons/Git.vue';
import IconsGame from '~/components/icons/Game.vue';
import IconsNode from '~/components/icons/Node.vue';
import IconsLinkedin from '~/components/icons/Linkedin.vue';
import IconsRuby from '~/components/icons/Ruby.vue';
import IconsFirebase from '~/components/icons/Firebase.vue';
import IconsElectron from '~/components/icons/Electron.vue';
import IconsWindow from '~/components/icons/Window.vue';
import IconsFigma from '~/components/icons/Figma.vue';
import IconsNuxt from '~/components/icons/Nuxt.vue';
import IconsGmail from '~/components/icons/Gmail.vue';

const props = defineProps(["icon"])

const iconComponentMap = {
  javascript: IconsJavascript,
  unity: IconsUnity,
  html: IconsHTML,
  css: IconsCSS,
  p5js: IconsP5,
  csharp: IconsCS,
  github: IconsGithub,
  githubPage: IconsGithubPage,
  vue: IconsVUE,
  php: IconsPHP,
  mysql: IconsMySQL,
  elasticsearch: IconsElasticSearch,
  photoshop: IconsPsIcon,
  aseprite: IconsAsepriteIcon,
  tailwind: IconsTailwindIcon,
  jetbrains: IconsJetbrains,
  more: IconsMore,
  git: IconsGit,
  game: IconsGame,
  node: IconsNode,
  linkedin: IconsLinkedin,
  ruby: IconsRuby,
  firebase: IconsFirebase,
  electron: IconsElectron,
  window: IconsWindow,
  figma: IconsFigma,
  nuxt: IconsNuxt,
  gmail: IconsGmail,
  // Add more mappings as needed
};

const iconComponent = iconComponentMap[props.icon] || null;

</script>

<template>
  <component :is="iconComponent"></component>
</template>