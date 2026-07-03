import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("legal pages each render a heading", async ({ page }) => {
  for (const path of ["/privacy", "/terms", "/cookies"]) {
    await page.goto(path);
    await expect(page.locator("h1").first()).toBeVisible();
  }
});

test("cookie banner offers equal-weight accept and reject", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /accept all/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /reject all/i })).toBeVisible();
});

test("home page has no serious accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );
  expect(serious).toEqual([]);
});
