import { test, expect } from "@playwright/test";

test.describe("Smoke Test", () => {
  test("loads root page or redirects correctly", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);
  });
});
