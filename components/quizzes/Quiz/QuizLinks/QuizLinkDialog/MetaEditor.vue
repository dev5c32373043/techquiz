<script setup>
const emit = defineEmits(['update:metadata']);
const props = defineProps({ metadata: Array });

function addEntry() {
  emit('update:metadata', [...props.metadata, { id: Date.now(), key: '', value: '' }]);
}

function removeEntry(id) {
  emit(
    'update:metadata',
    props.metadata.filter(e => e.id !== id)
  );
}
</script>

<template>
  <button type="button" class="btn btn-sm" @click="addEntry">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path d="M12 6V18" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M6 12H18" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    Extra data
  </button>

  <div class="flex items-center py-2 gap-2" v-for="item in metadata" :key="item.id">
    <div class="form-control">
      <label class="label" :for="`meta-${item.id}-key`">
        <span class="label-text">*Key</span>
      </label>
      <input
        :id="`meta-${item.id}-key`"
        type="text"
        class="input input-sm input-bordered w-full"
        v-model="item.key"
        required
      />
    </div>

    <div class="form-control">
      <label class="label" :for="`meta-${item.id}-value`">
        <span class="label-text">*Value</span>
      </label>
      <input
        :id="`meta-${item.id}-value`"
        type="text"
        class="input input-sm input-bordered w-full"
        v-model="item.value"
        required
      />
    </div>

    <div class="self-end">
      <button type="button" class="btn btn-sm btn-square btn-outline" @click="removeEntry(item.id)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
