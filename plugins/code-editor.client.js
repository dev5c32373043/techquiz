import hljs from 'highlight.js';
import SimpleCodeEditor from 'simple-code-editor';
// TODO: highlight.js is enormously large in size. It supports code splitting; however, we need to modify the library to achieve this.
export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('CodeEditor', SimpleCodeEditor);
});
