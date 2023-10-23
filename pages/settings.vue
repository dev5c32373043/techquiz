<script setup>
const { profile } = await useAsync(await useProfile());
</script>

<template>
  <div class="flex flex-col p-5" v-if="profile?._id">
    <h1 class="text-3xl text-center">Settings</h1>

    <h2 class="text-2xl font-bold">Profile</h2>
    <p class="text-gray-500">Scheduled for #3210 release (current #1)</p>
    <ProfileSettings />

    <h2 class="text-2xl font-bold mt-5">Quiz defaults</h2>
    <p class="text-gray-500">Global settings for new quizzes</p>
    <QuizSettings :profile="profile" />

    <h2 class="text-2xl font-bold mt-5">Notifications</h2>
    <p class="text-gray-500">Slack</p>
    <NotificationsSettings :profile="profile" />
  </div>
</template>
