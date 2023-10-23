import { storeToRefs } from 'pinia';
import { useProfileStore } from '~/stores/profile';

export async function useProfile() {
  const error = ref(null);
  const store = useProfileStore();
  const { profile } = storeToRefs(store);

  const result = { profile, error };
  if (isMongoId(profile?._id)) return result;

  const resp = await useFetch('/api/user/profile');
  if (resp.error.value) {
    result.error.value = resp.error.value;
    return result;
  }

  store.set(toValue(resp.data));

  return result;
}
