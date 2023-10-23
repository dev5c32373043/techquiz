import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quizzes', () => {
  const data = ref([]);

  function addItem(item) {
    data.value = [item, ...data.value];
  }

  function updateItem(item) {
    data.value = data.value.map(q => (q._id === item._id ? item : q));
  }

  function removeItem(item) {
    data.value = data.value.filter(q => q._id !== item._id);
  }

  function set(items) {
    data.value = items;
  }

  return { data, set, addItem, updateItem, removeItem };
});
