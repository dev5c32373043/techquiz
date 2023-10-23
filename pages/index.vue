<script setup>
definePageMeta({
  layout: false
});

useSeoMeta({
  title: 'TechQuiz: Your Ultimate Assessment Tool',
  description: 'TechQuiz empowers you to comprehensively evaluate developer expertise like never before'
});

import { useCodeClient } from 'vue3-google-signin';

const { $toast } = useNuxtApp();

const onSuccess = async ({ code }) => {
  const [err, resp] = await to($fetch('/api/auth/user/google/verify', { method: 'POST', body: { code } }));
  if (err) {
    $toast.error('Failed to login. Please try again');
    return;
  }

  if (resp.ok) {
    await navigateTo('/quizzes');
  }
};

const onError = errorResponse => {
  $toast.error('Failed to login. Please try again');
};

const { isReady, login } = useCodeClient({ onSuccess, onError });
</script>

<template>
  <main class="hero min-h-screen bg-slate-800">
    <div class="easter-egg">
      <div class="bubble" v-for=" in Array(9)" />
    </div>

    <div class="hero-content text-center">
      <div class="max-w-md text-slate-300">
        <h3
          class="animate-text bg-gradient-to-r from-slate-300 via-teal-300 to-indigo-500 bg-clip-text text-transparent text-3xl font-bold"
        >
          Introducing TechQuiz: Your Ultimate Developer Knowledge Assessment Tool!
        </h3>
        <p class="py-6">TechQuiz empowers you to comprehensively evaluate developer expertise like never before.</p>
        <button class="btn btn-secondary" @click="login" :disabled="!isReady">Login with Google</button>
      </div>
    </div>

    <div
      class="tooltip tooltip-info tooltip-left fixed right-5 bottom-5"
      data-tip="Cookies are our secret sauce for a better website"
    >
      <button class="btn btn-link"><img src="cookie.png" width="48" height="48" /></button>
    </div>
  </main>
</template>

<style>
.easter-egg {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  top: 0;
  left: 0;
}
.bubble {
  position: absolute;
  bottom: -100px;
  width: 40px;
  height: 40px;
  background: #f1f1f1;
  border-radius: 50%;
  opacity: 0.5;
  animation: rise 10s infinite ease-in;
}
.bubble:nth-child(1) {
  width: 40px;
  height: 40px;
  left: 10%;
  animation-duration: 8s;
}
.bubble:nth-child(2) {
  width: 20px;
  height: 20px;
  left: 20%;
  animation-duration: 5s;
  animation-delay: 1s;
}
.bubble:nth-child(3) {
  width: 50px;
  height: 50px;
  left: 35%;
  animation-duration: 7s;
  animation-delay: 2s;
}
.bubble:nth-child(4) {
  width: 80px;
  height: 80px;
  left: 50%;
  animation-duration: 11s;
  animation-delay: 0s;
}
.bubble:nth-child(5) {
  width: 35px;
  height: 35px;
  left: 55%;
  animation-duration: 6s;
  animation-delay: 1s;
}
.bubble:nth-child(6) {
  width: 45px;
  height: 45px;
  left: 65%;
  animation-duration: 8s;
  animation-delay: 3s;
}
.bubble:nth-child(7) {
  width: 90px;
  height: 90px;
  left: 70%;
  animation-duration: 12s;
  animation-delay: 2s;
}
.bubble:nth-child(8) {
  width: 25px;
  height: 25px;
  left: 80%;
  animation-duration: 6s;
  animation-delay: 2s;
}
.bubble:nth-child(9) {
  width: 15px;
  height: 15px;
  left: 70%;
  animation-duration: 5s;
  animation-delay: 1s;
}

@keyframes rise {
  0% {
    bottom: -100px;
    transform: translateX(0);
  }
  50% {
    transform: translate(100px);
  }
  100% {
    bottom: 1080px;
    transform: translateX(-200px);
  }
}
</style>
