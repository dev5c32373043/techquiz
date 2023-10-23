<script setup>
const selected = inject('selectedQuestion');
const props = defineProps({ questions: { type: Array, required: true } });

const emit = defineEmits(['onSelect']);

function switchQuestion(question) {
  if (selected?._id === question._id) return;
  emit('onSelect', question);
}
</script>

<template>
  <div class="flex gap-2">
    <ul class="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box p-0">
      <li v-for="(question, idx) in questions" :key="question.id">
        <button :class="{ active: selected?._id === question._id }" @click="switchQuestion(question)">
          <span class="max-w-[125px] truncate">{{ idx + 1 }}. {{ question.title }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
