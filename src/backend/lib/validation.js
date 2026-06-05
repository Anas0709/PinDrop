const MAX_STEM_LENGTH = 8000;
const MAX_CHOICE_LENGTH = 2000;
const MIN_CHOICES = 2;
const MAX_CHOICES = 26;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateClassifyPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  const { stem, choice, choices } = body;

  if (choices !== undefined) {
    if (!Array.isArray(choices)) {
      return { ok: false, error: 'choices must be an array' };
    }
    if (choices.length < MIN_CHOICES || choices.length > MAX_CHOICES) {
      return {
        ok: false,
        error: `choices must contain between ${MIN_CHOICES} and ${MAX_CHOICES} items`,
      };
    }
    for (let i = 0; i < choices.length; i += 1) {
      const item = choices[i];
      if (!isNonEmptyString(item)) {
        return { ok: false, error: `choices[${i}] must be a non-empty string` };
      }
      if (item.length > MAX_CHOICE_LENGTH) {
        return { ok: false, error: `choices[${i}] exceeds maximum length` };
      }
    }
    if (!isNonEmptyString(stem)) {
      return { ok: false, error: 'Missing required field: stem' };
    }
    if (stem.length > MAX_STEM_LENGTH) {
      return { ok: false, error: 'stem exceeds maximum length' };
    }
    return { ok: true, mode: 'multiple' };
  }

  if (!isNonEmptyString(stem) || !isNonEmptyString(choice)) {
    return { ok: false, error: 'Missing required fields: stem and choice' };
  }
  if (stem.length > MAX_STEM_LENGTH || choice.length > MAX_CHOICE_LENGTH) {
    return { ok: false, error: 'stem or choice exceeds maximum length' };
  }
  return { ok: true, mode: 'single' };
}

module.exports = {
  validateClassifyPayload,
  MAX_STEM_LENGTH,
  MAX_CHOICE_LENGTH,
};
