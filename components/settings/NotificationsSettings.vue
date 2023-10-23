<script setup>
const { $toast } = useNuxtApp();
const config = useRuntimeConfig();

const { profile } = defineProps({ profile: { type: Object, required: true } });
const notifications = ref(profile.settings?.notifications ?? { slack: { channelId: '' } });

async function onSubmit() {
  const body = { notifications: toValue(notifications) };
  const [err] = await to($fetch('/api/user/profile', { method: 'PUT', body }));
  if (err) {
    $toast.error('Error while updating settings');
    return;
  }

  $toast.success('Settings updated!');
}

const url = useRequestURL();
const query = new URLSearchParams({
  client_id: '5980373488213.5995065493303',
  scope: 'channels:read,channels:join,chat:write',
  redirect_uri: `${config.public.host}/api/auth/user/slack/install`
});

const slackLink = `https://slack.com/oauth/v2/authorize?${query}`;
</script>

<template>
  <a class="slack-link" :href="slackLink" v-if="!profile.settings.integrations?.slack?.accessToken">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style="height: 20px; width: 20px; margin-right: 12px"
      viewBox="0 0 122.8 122.8"
    >
      <path
        d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z"
        fill="#e01e5a"
      ></path>
      <path
        d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z"
        fill="#36c5f0"
      ></path>
      <path
        d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z"
        fill="#2eb67d"
      ></path>
      <path
        d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z"
        fill="#ecb22e"
      ></path>
    </svg>
    <span>Add to Slack</span>
  </a>

  <form @submit.prevent="onSubmit" v-else>
    <div class="form-control w-full gap-2">
      <label class="label" for="slack-channel">
        <span class="label-text">Please make sure to add app integration to the selected channel</span>
      </label>

      <select id="slack-channel" class="select select-success w-full max-w-md" v-model="notifications.slack.channelId">
        <option value="">Pick your public channel</option>
        <option v-for="channel in profile.settings.integrations.slack.channels" :value="channel.id">
          {{ channel.name }}
        </option>
      </select>
    </div>

    <div class="my-5">
      <button type="submit" class="btn btn-primary">Save</button>
    </div>
  </form>
</template>

<style>
.slack-link {
  align-items: center;
  color: #fff;
  background-color: #4a154b;
  border: 0;
  border-radius: 4px;
  display: inline-flex;
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  justify-content: center;
  text-decoration: none;
  width: 236px;
}
</style>
