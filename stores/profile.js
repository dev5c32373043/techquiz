import { defineStore } from 'pinia';

export const useProfileStore = defineStore('profile', () => {
  const profile = ref(null);

  function set(data) {
    profile.value = data;
  }

  return { profile, set };
});
