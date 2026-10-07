import { instant } from "@next/playwright";
import { expect, test } from "@playwright/test";
import { SEED_ENTRY_TITLE } from "./fixtures";

test.describe("instant navigation", () => {
  test("journal list commits under the lock from calendar", async ({
    page,
  }) => {
    await page.goto("/journal/calendar");
    const trigger = page.locator(
      'a[data-sidebar="menu-button"][href="/journal"]',
    );
    await expect(trigger).toBeVisible();

    await instant(page, async () => {
      await trigger.click();
      await page.waitForURL("**/journal");
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.getByTestId("entry-link").first()).toBeVisible();
    });
  });

  test("entry detail renders its skeleton without intent prefetch", async ({
    page,
  }) => {
    await page.goto("/journal");
    const entryLink = page.getByTestId("entry-link").first();
    await expect(entryLink).toBeVisible();
    const href = await entryLink.getAttribute("href");

    await instant(page, async () => {
      await entryLink.evaluate((el: HTMLElement) => el.click());
      await page.waitForURL(`**${href}`);
      await expect(page.getByTestId("entry-detail-skeleton")).toBeVisible();
      await expect(page.getByLabel("Title")).toHaveCount(0);
    });
    await expect(page.getByLabel("Title")).toHaveValue(SEED_ENTRY_TITLE);
  });

  test("entry detail is ready before the click on intent prefetch", async ({
    page,
  }) => {
    await page.goto("/journal");
    const entryLink = page.getByTestId("entry-link").first();
    await expect(entryLink).toBeVisible();
    const href = (await entryLink.getAttribute("href")) ?? "";

    const perLinkPrefetch = page.waitForResponse((res) =>
      res.url().includes(href),
    );
    await entryLink.hover();
    await perLinkPrefetch;

    await instant(page, async () => {
      await entryLink.click();
      await page.waitForURL(`**${href}`);
      await expect(page.getByLabel("Title")).toHaveValue(SEED_ENTRY_TITLE);
      await expect(page.getByTestId("entry-detail-skeleton")).toHaveCount(0);
    });
  });
});
