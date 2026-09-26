const attachCoverageIds = () => {
  document.querySelectorAll(".check").forEach((label) => {
    const value = label.querySelector("input")?.value;
    if (!value) return;
    const slug = value.toLowerCase().replaceAll(" ", "-").replaceAll("+", "and");
    label.dataset.testid = `coverage-option-${slug}`;
    label.querySelector("input").dataset.testid = `coverage-checkbox-${slug}`;
  });
};

const observer = new MutationObserver(attachCoverageIds);
observer.observe(document.documentElement, { childList: true, subtree: true });
attachCoverageIds();