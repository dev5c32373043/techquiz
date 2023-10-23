<template>
  <footer class="footer items-center p-4 bg-slate-800 text-neutral-content select-none">
    <aside class="items-center grid-flow-col">
      <NuxtLink class="focus:outline-none" to="/">
        <img src="/logo.svg" width="36" height="36" alt="Logo" />
      </NuxtLink>
      <p>TechQuiz © {{ new Date().getFullYear() }} - All rights unreserved</p>
    </aside>
  </footer>
</template>
