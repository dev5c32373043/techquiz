<script setup>
const emit = defineEmits(['onTimeUp']);
const { targetDate } = defineProps({ targetDate: { type: String, required: true } });

const updateTrigger = ref(1);

const formattedTime = computed(() => {
  if (updateTrigger.value === 0) return;

  const timeLeftMs = new Date(targetDate).valueOf() - Date.now();
  const minutes = Math.floor(timeLeftMs / 60000);
  const seconds = Math.floor((timeLeftMs % 60000) / 1000);
  return { minutes, seconds };
});

let intervalId;

const updateTime = () => {
  const { minutes, seconds } = formattedTime.value;

  if (minutes > 0 || seconds > 0) {
    updateTrigger.value += 1;
    return;
  }

  emit('onTimeUp');
  clearInterval(intervalId);
};

onMounted(() => {
  intervalId = setInterval(updateTime, 500);
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="countdown bg-slate-800 font-mono text-2xl text-neutral-content p-3 bordered rounded">
    <span :style="{ '--value': formattedTime.minutes }"></span>:
    <span :style="{ '--value': formattedTime.seconds }"></span>
  </div>
</template>
