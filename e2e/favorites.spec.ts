import { expect, test } from "@playwright/test";
import { SEED_ENTRY_TITLE } from "./fixtures";

test.describe("favorite dreams", () => {
  test("marking an entry favorite lists it on the favorites page", async ({
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

    const toggle = page.getByTestId("favorite-toggle");
    await expect(toggle).toBeVisible();
    if ((await toggle.getAttribute("aria-pressed")) === "true") {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
    }

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(toggle).toHaveAccessibleName("Remove from favorites");

    await page.goto("/journal/favorites");
    const favoriteLink = page.locator(
      `[data-testid="entry-link"][href="${href}"]`,
    );
    await expect(favoriteLink).toBeVisible();
    await expect(favoriteLink.getByTestId("favorite-badge")).toBeVisible();

    await page.goto(href);
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(toggle).toHaveAccessibleName("Mark as favorite");

    await page.goto("/journal/favorites");
    await expect(favoriteLink).toHaveCount(0);
  });
});
