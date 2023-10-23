export const to = async promise => promise.then(data => [null, data]).catch(err => [err]);

export const isMongoId = str => str && /^[0-9a-fA-F]{24}$/.test(str);

export const pick = (obj, keysToInclude) => {
  const clonedObj = structuredClone(obj);
  const newObj = {};

  for (const key of keysToInclude) {
    if (!clonedObj.hasOwnProperty(key)) continue;
    newObj[key] = clonedObj[key];
  }

  return newObj;
};

export const omit = (obj, keysToExclude) => {
  const clonedObj = structuredClone(obj);
  const newObj = {};

  for (const key in clonedObj) {
    if (keysToExclude.includes(key)) continue;
    newObj[key] = clonedObj[key];
  }

  return newObj;
};

export const shuffleArray = array => {
  const arrayCopy = structuredClone(array);

  for (let currentIdx = arrayCopy.length - 1; currentIdx > 0; currentIdx--) {
    const randomIdx = Math.floor(Math.random() * (currentIdx + 1));
    [arrayCopy[currentIdx], arrayCopy[randomIdx]] = [arrayCopy[randomIdx], arrayCopy[currentIdx]];
  }

  return arrayCopy;
};

export const UnauthorizedError = () => createError({ statusCode: 401, statusMessage: 'Unauthorized' });
export const QuizNotFoundError = () => createError({ statusCode: 404, statusMessage: 'Quiz not found or expired' });

export const validatePayload = (dto, data, throwError = true) => {
  const result = dto.safeParse(data);
  if (!result.success) {
    if (throwError) {
      throw createError({
        statusCode: 400,
        data: result.error
      });
    }
  }

  const value = !throwError ? result : result.data;
  return value;
};

export function QueryBuilder(httpEvent) {
  const { currentUser } = httpEvent.context;
  if (!currentUser) {
    throw UnauthorizedError();
  }

  this.baseQuery = { userId: currentUser._id };
  return (query = {}) => ({ ...query, ...this.baseQuery });
}

import { useLogger } from '@nuxt/kit';

export const logger = useLogger('app');
