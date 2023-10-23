import db from '~/server/db';
import slackClient from '~/server/utils/slack-client';

export function calculateQuizScore(questions) {
  let score = 0;

  for (const question of questions) {
    const selectedOptions = question.options.reduce((acc, opt) => {
      if (opt.isSelected) {
        acc.push(opt.id);
      }

      return acc;
    }, []);

    const { answerIds } = question;

    if (question.variant === 'single' && answerIds.includes(selectedOptions.at(0))) {
      score += 1;
    }

    if (question.variant === 'multi') {
      // For now, we consider the answer correct only if all options are checked.
      // Ideally, there should be a setting to determine expected behavior
      const allCorrect = answerIds.every(optId => selectedOptions.includes(optId));
      if (allCorrect) {
        score += 1;
      }
    }

    if (question.variant === 'code') {
      score += 1; // there is no such thing as wrong code :)
    }
  }

  return score;
}

export async function notifyQuizOwner(quiz, link, latestAttempt) {
  const [fetchErr, user] = await to(db.User.findOne({ _id: quiz.userId }).select('settings').lean());
  if (fetchErr) {
    logger.error(fetchErr);
    return;
  }

  if (!user.settings.notifications?.slack?.channelId) return;

  const text = `:trophy: *Quiz Completion Alert* :trophy:\n\nUser with *${link.name}* link has successfully completed the quiz *${quiz.title}* and achieved a score of *${latestAttempt.score}*`;
  const { accessToken } = user.settings.integrations.slack;
  const { channelId } = user.settings.notifications.slack;
  const [sendErr] = await to(slackClient.chat.postMessage({ text, token: accessToken, channel: channelId }));
  if (sendErr) {
    logger.error(sendErr);
  }
}
