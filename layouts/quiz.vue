<script setup>
import Fingerprint from '@fingerprintjs/fingerprintjs';

useSeoMeta({
  title: 'TechQuiz: Unleash your knowledge power'
});

const visitorId = ref(null);

const {
  params: { accessToken }
} = useRoute();

async function getVisitorId() {
  const fp = await Fingerprint.load();
  const result = await fp.get();
  visitorId.value = result.visitorId;
}

onMounted(() => {
  getVisitorId();
});

provide('visitorId', visitorId);
</script>

<template>
  <div class="flex flex-col h-screen">
    <slot />
    <Footer />
  </div>
</template>
