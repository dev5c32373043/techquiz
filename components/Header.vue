<script setup>
const { $toast } = useNuxtApp();
const { error, profile } = await useProfile();

async function logout() {
  const [logoutErr] = await to($fetch(`/api/auth/user/logout`, { method: 'POST' }));
  if (logoutErr) {
    $toast.error('Failed to logout 😅');
    return;
  }

  navigateTo('/', { replace: true });
}

onMounted(() => {
  if (!error.value) return;
  $toast.error('Failed to load profile 😳');
});
</script>

<template>
  <header
    class="border-b-1 relative z-20 w-full bg-slate-800 after:absolute after:top-full after:left-0 after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:border-slate-200 lg:backdrop-blur-sm lg:after:hidden"
  >
    <div class="relative mx-auto max-w-full lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
      <nav aria-label="main navigation" class="flex h-[4.5rem] items-center justify-between font-medium">
        <NuxtLink
          class="flex items-center gap-2 whitespace-nowrap py-3 text-lg text-neutral-content focus:outline-none"
          to="/quizzes"
        >
          <img src="/logo.svg" width="48" height="48" alt="Logo" />
          TechQuiz
        </NuxtLink>

        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full"><img :src="profile?.picture ?? '/user.png'" /></div>
          </label>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><NuxtLink to="/settings">Settings</NuxtLink></li>
            <li><button @click="logout">Logout</button></li>
          </ul>
        </div>
      </nav>
    </div>
  </header>
</template>
