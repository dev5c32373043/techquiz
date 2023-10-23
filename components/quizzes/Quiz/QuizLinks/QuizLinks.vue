<script setup>
const props = defineProps({ quizId: String, links: Array });
const linkDialog = ref(null);

const links = ref(props.links);

async function onCreate(createdLink, withCopy = false) {
  links.value.unshift(createdLink);

  if (withCopy) {
    await copyLink(createdLink.accessToken);
    return;
  }

  $toast.success('Link successfully created!');
}

function onUpdate(updatedLink) {
  links.value = links.value.map(l => (l._id === updatedLink._id ? updatedLink : l));
  $toast.success('Link successfully updated!');
}

const { $toast } = useNuxtApp();

const url = useRequestURL();

async function copyLink(linkToken) {
  const linkURL = `${url.origin}/q/${linkToken}`;
  const [err] = await to(navigator.clipboard.writeText(linkURL));
  if (err) {
    $toast.error('Failed to copy...Please try again');
  }

  $toast.success('Link successfully copied!');
}

const baseUrl = `/api/quizzes/${props.quizId}/links`;

async function removeLink(linkId) {
  const [removalErr] = await to($fetch(`${baseUrl}/${linkId}`, { method: 'DELETE' }));
  if (removalErr) {
    $toast.error('Failed to remove...Please try again');
    return;
  }

  links.value = links.value.filter(l => l._id !== linkId);
  $toast.success('Link removed!');
}
</script>

<template>
  <div class="md:w-full lg:w-3/4 p-5 border rounded">
    <button class="btn btn-secondary self-start" @click="linkDialog.showDialog()">Create link</button>
    <QuizLinkDialog ref="linkDialog" :quiz-id="props.quizId" :on-create="onCreate" :on-update="onUpdate" />

    <ul v-if="links.length > 0">
      <li
        class="flex items-start gap-4 px-4 py-3 my-3 rounded shadow-md shadow-slate-200"
        v-for="link in links"
        :key="link.id"
      >
        <div class="flex items-center self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke="currentColor"
            viewBox="0 0 24 24"
            class="w-6 h-6"
            aria-label="Dashboard icon"
            role="graphics-symbol"
          >
            <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>

        <div class="flex flex-col gap-0 min-h-[2rem] items-start justify-center w-full">
          <h4 class="text-base text-slate-700">{{ link.name }}</h4>
          <p class="w-full text-sm truncate text-slate-500" v-if="link.metadata?.length > 0">
            {{ link.metadata.map(e => `${e.key}: ${e.value}`).join(', ') }}
          </p>
        </div>

        <div class="flex justify-center gap-2">
          <button class="btn" @click="removeLink(link._id)">Remove</button>
          <button class="btn" @click="linkDialog.showDialog(link)">Edit</button>
          <button class="btn" @click="copyLink(link.accessToken)">Copy</button>
        </div>
      </li>
    </ul>

    <EmptyState v-else />
  </div>
</template>
