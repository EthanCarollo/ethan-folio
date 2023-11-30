// plugins/vuetify.js

import Tetikus from '@namchee/tetikus';
import '@namchee/tetikus/dist/tetikus.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Tetikus)
})