import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home renders and nav works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "YouStillMatter" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Grounding" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Breathe" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Mood" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Crisis" })).toBeVisible();

  await page.getByRole("link", { name: "Crisis" }).click();
  await expect(page.getByRole("heading", { name: "Crisis" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Call 988 Lifeline" })).toBeVisible();
});

test("basic accessibility on home", async ({ page }) => {
  await page.goto("/");
  const axe = new AxeBuilder({ page });
  const results = await axe.analyze();
  expect(results.violations).toEqual([]);
});
