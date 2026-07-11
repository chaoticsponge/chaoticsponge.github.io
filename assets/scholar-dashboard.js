(() => {
  const stats = window.SCHOLAR_STATS;

  if (!stats) return;

  document.querySelectorAll("[data-scholar-stat]").forEach((element) => {
    const value = stats[element.dataset.scholarStat];
    if (Number.isInteger(value)) element.textContent = value.toLocaleString("en");
  });

  document.querySelectorAll("[data-scholar-updated]").forEach((element) => {
    const date = new Date(`${stats.updated}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return;

    element.dateTime = stats.updated;
    element.textContent = new Intl.DateTimeFormat("en", {
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  });

  const chart = document.querySelector(".citation-chart");
  const yearlyCitations = Object.entries(stats.citationsByYear || {})
    .filter(([year, value]) => /^20\d{2}$/.test(year) && Number.isInteger(value) && value >= 0)
    .sort(([yearA], [yearB]) => yearA.localeCompare(yearB));

  if (!chart || yearlyCitations.length === 0) return;

  const maxCitations = Math.max(...yearlyCitations.map(([, value]) => value), 1);
  chart.replaceChildren();
  chart.style.setProperty("--chart-columns", yearlyCitations.length);

  yearlyCitations.forEach(([year, value]) => {
    const bar = document.createElement("div");
    const fill = document.createElement("span");
    const label = document.createElement("span");

    bar.className = "citation-bar";
    fill.className = "citation-bar-fill";
    fill.dataset.value = String(value);
    fill.style.setProperty("--height", `${(value / maxCitations) * 100}%`);
    label.className = "citation-bar-label";
    label.textContent = year;

    bar.append(fill, label);
    chart.append(bar);
  });

  const description = yearlyCitations
    .map(([year, value]) => `${value} in ${year}`)
    .join(", ");
  chart.setAttribute("aria-label", `Google Scholar citations by year: ${description}`);
})();
