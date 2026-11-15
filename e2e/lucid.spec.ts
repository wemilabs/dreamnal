import { expect, test } from "@playwright/test";
import { SEED_ENTRY_TITLE } from "./fixtures";

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
    await entryLink.click();
    await page.waitForURL(`**${href}`);

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
      `[data-testid="entry-link"][href="${href}"]`,
    );
    await expect(lucidLink).toBeVisible();
    await expect(lucidLink.getByText("Lucid", { exact: true })).toBeVisible();

    await page.goto(href);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toHaveAccessibleName("Mark as lucid");

    await page.goto("/journal/lucid");
    await expect(lucidLink).toHaveCount(0);
  });
});
