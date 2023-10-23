<script setup>
import supportedLanguages from './supported-languages.json';

const emit = defineEmits(['onUpdate']);
const props = defineProps({ mode: String, question: Object });

const question = inject('selectedQuestion', ref(props.question));
const langs = computed(() => (props.mode === 'edit' ? supportedLanguages : [[question.value.code.lang]]));

const textarea = ref(null);

const code = reactive(question.value.code);

function onLangSelect(lang) {
  if (code.lang === lang) return;

  code.lang = lang;
  emit('onUpdate', { code: toValue(code) });
}

let timeSpentMs = 0;
let focusedAt = null;

function onTextareaFocus(ev) {
  focusedAt = Date.now();
}

function onTextareaBlur(ev) {
  if (props.mode === 'form') {
    timeSpentMs += Date.now() - focusedAt;
    code.timeSpentMs = timeSpentMs;
  }

  emit('onUpdate', { code: { ...toValue(code) } });
}

function onTextareaInit(node) {
  if (props.mode === 'view') return;
  if (props.mode === 'form') {
    node.addEventListener('focus', onTextareaFocus);
  }

  node.addEventListener('blur', onTextareaBlur);
  textarea.value = node;
}

onUnmounted(() => {
  if (props.mode === 'view') return;
  if (props.mode === 'form') {
    textarea.value.removeEventListener('focus', onTextareaFocus);
  }

  textarea.value.removeEventListener('blur', onTextareaBlur);
});
</script>

<template>
  <div class="py-4 self-start" :class="{ 'select-none': mode === 'view' }">
    <ClientOnly>
      <CodeEditor
        theme="github-dark"
        width="100%"
        min-width="200px"
        lang-list-height="200px"
        v-model="code.content"
        :header="mode === 'edit'"
        :languages="langs"
        :copy-code="false"
        :display-language="mode === 'edit'"
        :read-only="mode === 'view'"
        @lang="onLangSelect"
        @textarea="onTextareaInit"
      />
    </ClientOnly>
  </div>
</template>
