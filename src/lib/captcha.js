/**
 * Utility helper to generate a simple math CAPTCHA challenge.
 * Returns an object with two random single-digit numbers and their sum answer.
 * @returns {{ numA: number, numB: number, answer: number }}
 */
export function generateCaptchaChallenge() {
  const numA = Math.floor(Math.random() * 9) + 1;
  const numB = Math.floor(Math.random() * 9) + 1;
  return {
    numA,
    numB,
    answer: numA + numB
  };
}
