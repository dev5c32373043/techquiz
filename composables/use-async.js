export async function useAsync(resp) {
  const err = toValue(resp.error);
  if (err) {
    if (err.statusCode === 401) {
      await navigateTo('/');
      return resp;
    }

    if (err.statusCode === 403) {
      const { data } = err;
      const { redirectPath } = data.data;
      if (redirectPath) {
        await navigateTo(redirectPath);
        return resp;
      }
    }

    throw createError({ statusCode: err.statusCode, statusMessage: err.statusMessage });
  }

  return resp;
}
