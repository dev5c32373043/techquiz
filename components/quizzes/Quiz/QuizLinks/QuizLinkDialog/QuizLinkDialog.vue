<script setup>
const props = defineProps({ quizId: String, onCreate: Function, onUpdate: Function });

const dialogRef = ref(null);
const linkTmp = ref({ name: '', metadata: [] });

const { $toast } = useNuxtApp();

function showDialog(tmp) {
  if (isMongoId(tmp?._id)) {
    linkTmp.value = structuredClone(toRaw(tmp));
  }

  dialogRef.value.showModal();
}

function closeDialog() {
  linkTmp.value = { name: '', metadata: [] };
  dialogRef.value.close();
}

let reqState = reactive({ status: 'idle' });

async function onSubmit(ev) {
  if (reqState.status !== 'idle') return;

  const link = toValue(linkTmp);
  const action = isMongoId(link._id) ? 'update' : 'create';
  const baseUrl = `/api/quizzes/${props.quizId}/links`;

  if (action === 'create') {
    const [err, data] = await to($fetch(baseUrl, { method: 'POST', body: link }));
    if (err) {
      $toast.error('Failed to create quiz');
      reqState.status = 'idle';
      return;
    }

    linkTmp.value = data;

    const withCopy = ev.submitter?.dataset?.withCopy === 'true';
    props.onCreate(data, withCopy);
  }

  if (action === 'update') {
    const [err, data] = await to($fetch(`${baseUrl}/${link._id}`, { method: 'PUT', body: link }));
    if (err) {
      $toast.error('Failed to create quiz');
      reqState.status = 'idle';
      return;
    }

    linkTmp.value = data;
    props.onUpdate(data);
  }

  reqState.status = 'idle';
  closeDialog();
}

defineExpose({ showDialog, closeDialog });
</script>

<template>
  <dialog class="modal modal-bottom sm:modal-middle" ref="dialogRef">
    <form method="POST" class="modal-box sm:max-w-2xl" @submit.prevent="onSubmit">
      <h3 class="font-bold text-lg">Link</h3>

      <div class="py-4">
        <label class="label" for="link-name">
          <span class="label-text">*Name</span>
        </label>

        <input
          id="link-name"
          name="name"
          type="text"
          placeholder="Would be nice to have some name"
          class="input input-bordered w-full"
          v-model="linkTmp.name"
          required
        />
      </div>

      <div class="py-4">
        <MetaEditor v-model:metadata="linkTmp.metadata" />
      </div>

      <div class="modal-action">
        <button type="button" class="btn" @click="closeDialog">Close</button>
        <button type="submit" class="btn">
          <span class="loading loading-spinner" v-if="reqState.status !== 'idle'" />
          Save
        </button>

        <button type="submit" class="btn" data-with-copy="true" v-if="!linkTmp._id">
          <span class="loading loading-spinner" v-if="reqState.status !== 'idle'" />
          Save & Copy
        </button>
      </div>
    </form>
  </dialog>
</template>
