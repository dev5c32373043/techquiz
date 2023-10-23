export function useTabs(tabs, defaultTab = '', { matcher, onSelect } = {}) {
  if (!Array.isArray(tabs)) {
    throw new Error('tabs must be an array');
  }

  const currentTab = ref(defaultTab);
  const switchTab = tabName => {
    if (currentTab.value === tabName) return;
    if (typeof matcher === 'function' && !matcher(tabName)) return;
    if (!tabs.includes(tabName)) {
      throw new Error(`tab must be one of ${tabs.join(', ')}`);
    }

    currentTab.value = tabName;

    if (typeof onSelect === 'function') {
      onSelect(tabName);
    }
  };

  return {
    currentTab,
    switchTab
  };
}
