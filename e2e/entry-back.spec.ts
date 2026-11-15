import { expect, test } from "@playwright/test";
import { entryPath, SEED_ENTRY_TITLE, urlIs } from "./fixtures";

test.describe("entry back button", () => {
  test("returns to the journal and lines up with the title", async ({
    page,
  }) => {
    await page.goto("/journal");
    const entryLink = page
      .getByTestId("entry-link")
      .filter({ hasText: SEED_ENTRY_TITLE })
      .first();
    const href = (await entryLink.getAttribute("href")) ?? "";
    expect(href).toBe(`${entryPath(href)}?from=%2Fjournal`);
    await entryLink.click();
    await page.waitForURL(urlIs(href));

    const back = page.getByRole("link", { name: "Back to journal" });
    const title = page.getByRole("textbox", { name: "Title" });
    await expect(title).toHaveValue(SEED_ENTRY_TITLE);
    const arrowBox = await back.locator("svg").boundingBox();
    const titleBox = await title.boundingBox();
    expect(arrowBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    expect(
      Math.abs((arrowBox?.x ?? 0) - (titleBox?.x ?? 0)),
    ).toBeLessThanOrEqual(2);

    await back.click();
    await page.waitForURL(urlIs("/journal"));
  });

  test("restores the journal filter", async ({ page }) => {
    await page.goto("/journal");
    const href =
      (await page.getByTestId("entry-link").first().getAttribute("href")) ?? "";
    await page.goto(
      `${entryPath(href)}?from=${encodeURIComponent("/journal?filter=all")}`,
    );
    await expect(
      page.getByRole("link", { name: "Back to journal" }),
    ).toHaveAttribute("href", "/journal");

    await page.goto(
      `${entryPath(href)}?from=${encodeURIComponent("/journal?filter=fulfilled")}`,
    );
    await page.getByRole("link", { name: "Back to journal" }).click();
    await page.waitForURL(urlIs("/journal?filter=fulfilled"));
  });

  test("ignores a from outside the journal", async ({ page }) => {
    await page.goto("/journal");
    const href =
      (await page.getByTestId("entry-link").first().getAttribute("href")) ?? "";
    for (const from of [
      "https://evil.example",
      "//evil.example",
      "/journalx",
    ]) {
      await page.goto(`${entryPath(href)}?from=${encodeURIComponent(from)}`);
      await expect(
        page.getByRole("link", { name: "Back to journal" }),
      ).toHaveAttribute("href", "/journal");
    }
  });
});
