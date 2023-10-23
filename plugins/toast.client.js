import Vue3Toasity, { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(Vue3Toasity, {
    theme: 'dark',
    transition: toast.TRANSITIONS.ZOOM,
    hideProgressBar: true
  });

  return {
    provide: { toast }
  };
});
