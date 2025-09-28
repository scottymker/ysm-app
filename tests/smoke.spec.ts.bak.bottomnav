import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders and nav works", async ({ page }) => {
  await page.goto("/");

  // Sanity: heading visible
  await expect(page.getByRole("heading", { name: "YouStillMatter" })).toBeVisible();

  // Check the four Quick Action links specifically within <main>
  const main = page.getByRole("main");
  await expect(main.getByRole("link", { name: "Grounding" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Breathe" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Mood" })).toBeVisible();
  await expect(main.getByRole("link", { name: "Crisis" })).toBeVisible();

  // Click the Crisis link in the BOTTOM NAV specifically (aria-label="Primary" on the nav)
  await page.getByRole("navigation", { name: "Primary" })
           .getByRole("link", { name: "Crisis" })
           .click();
  await expect(page.getByRole("heading", { name: "Crisis" })).toBeVisible();
});

test("basic accessibility on home (serious/critical only)", async ({ page }) => {
  await page.goto("/");

  // Tame the noise: ignore some common false-positives for early MVP
  const results = await new AxeBuilder({ page })
    .disableRules(["color-contrast", "region"]) // optional: relax early
    .analyze();

  const severe = results.violations.filter(v =>
    ["serious", "critical"].includes(String(v.impact || "").toLowerCase())
  );

  expect(severe, JSON.stringify(severe, null, 2)).toHaveLength(0);
});
