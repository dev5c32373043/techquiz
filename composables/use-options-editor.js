export function useOptionEditor(question, onChange) {
  let newOptionId = null;

  function handleKeyDown(ev, optionId) {
    const { key, target } = ev;
    let { options } = question.value;

    if (key === 'Enter') {
      const id = options.length + 1;
      const newOption = { id, value: '', isSelected: false };
      newOptionId = id;
      options.push(newOption);
      onChange(options);
    }

    if (key === 'Backspace') {
      if (target.value.length > 0) return;
      if (options.length === 1) return;

      ev.preventDefault();
      newOptionId = optionId > 1 ? optionId - 1 : null;
      options = options.filter(option => option.id !== optionId);
      onChange(options);
    }
  }

  function focusOnNextInput(el, optionId) {
    if (newOptionId !== optionId) return;

    nextTick(() => {
      el.focus();
      newOptionId = null;
    });
  }

  return {
    handleKeyDown,
    focusOnNextInput
  };
}
