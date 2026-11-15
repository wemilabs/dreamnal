import { expect, test } from "@playwright/test";
import { entryPath, SEED_ENTRY_TITLE, urlIs } from "./fixtures";

test.describe("lucid dreams", () => {
  test("marking an entry lucid lists it on the lucid page", async ({
    page,
  }) => {
    await page.goto("/journal");
    const entryLink = page
      .getByTestId("entry-link")
      .filter({ hasText: SEED_ENTRY_TITLE })
      .first();
    await expect(entryLink).toBeVisible();
    const href = (await entryLink.getAttribute("href")) ?? "";
    const path = entryPath(href);
    await entryLink.click();
    await page.waitForURL(urlIs(href));

    const toggle = page.getByTestId("lucid-toggle");
    await expect(toggle).toBeVisible();
    if ((await toggle.getAttribute("aria-pressed")) === "true") {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
    }

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAccessibleName("Unmark lucid");

    await page.goto("/journal/lucid");
    const lucidLink = page.locator(
      `[data-testid="entry-link"][href^="${path}?"]`,
    );
    await expect(lucidLink).toBeVisible();
    await expect(lucidLink.getByText("Lucid", { exact: true })).toBeVisible();

    await lucidLink.click();
    await page.waitForURL(urlIs(`${path}?from=%2Fjournal%2Flucid`));
    await page.getByRole("link", { name: "Back to journal" }).click();
    await page.waitForURL(urlIs("/journal/lucid"));

    await page.goto(path);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toHaveAccessibleName("Mark as lucid");

    await page.goto("/journal/lucid");
    await expect(lucidLink).toHaveCount(0);
  });
});
