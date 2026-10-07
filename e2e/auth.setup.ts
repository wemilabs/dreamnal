import { expect, test as setup } from "@playwright/test";
import { SEED_ENTRY_BODY, SEED_ENTRY_TITLE } from "./fixtures";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

setup.setTimeout(120_000);

setup("sign in and seed an entry", async ({ page }) => {
  if (!email || !password) {
    throw new Error("E2E_EMAIL and E2E_PASSWORD must be set in .env.local");
  }

  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  const formError = page.locator("form").getByRole("alert");
  const signedIn = Promise.race([
    page.waitForURL(/\/journal\/?$/).then(() => true),
    formError
      .waitFor()
      .then(() => false)
      .catch(() => true),
  ]);
  await page.getByRole("button", { name: "Sign in" }).click();

  if (!(await signedIn)) {
    await page.goto("/auth/sign-up");
    await page.getByLabel("Name").fill("E2E");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Create account" }).click();
    await page.waitForURL(/\/journal\/?$/);
  }

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.context().storageState({ path: "e2e/.auth/user.json" });

  const entryLink = page.getByTestId("entry-link").first();
  const emptyHeading = page.getByRole("heading", {
    name: "Nothing written yet",
  });
  await expect(entryLink.or(emptyHeading)).toBeVisible();

  if (await emptyHeading.isVisible()) {
    await page.getByRole("button", { name: /type it instead/ }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title").fill(SEED_ENTRY_TITLE);
    await dialog.getByLabel("Dream").fill(SEED_ENTRY_BODY);
    await dialog.getByRole("button", { name: "Save entry" }).click();
    await expect(dialog).toBeHidden();
    await page.reload();
    await expect(entryLink).toBeVisible();
  }
});
