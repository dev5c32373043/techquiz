export const to = async promise => promise.then(data => [null, data]).catch(err => [err]);

export const isMongoId = str => str && /^[0-9a-fA-F]{24}$/.test(str);

export const quizResultInPercent = (score, questionsCount) => Math.floor((score / questionsCount) * 100);
