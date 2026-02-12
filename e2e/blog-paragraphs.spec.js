const { test, expect } = require('@playwright/test');

test('blog post content is visible and paragraphs display on new lines', async ({ page }) => {
  await page.goto('/blog/test-title');
  await page.waitForLoadState('networkidle');

  const blogContent = page.locator('article .blog-content').first();
  await expect(blogContent).toBeVisible();

  const htmlContainer = blogContent.locator('.blog-content-html');
  await expect(htmlContainer).toBeVisible();

  const textContent = await blogContent.textContent();
  expect(textContent?.trim().length).toBeGreaterThan(0);

  const blocks = blogContent.locator('.blog-content-block, .blog-content-html > p, .blog-content-html > div');
  const count = await blocks.count();
  if (count > 0) {
    for (let i = 0; i < count; i++) {
      const el = blocks.nth(i);
      const display = await el.evaluate((node) => window.getComputedStyle(node).display);
      expect(display).toBe('block');
    }
  }
});

test('blog post: "You might also like" section comes after the blog content', async ({ page }) => {
  await page.goto('/blog/test-title');
  await page.waitForLoadState('networkidle');

  const body = page.locator('article .blog-post-body');
  await expect(body).toBeVisible();

  const content = body.locator('.blog-content').first();
  await expect(content).toBeVisible();

  const section = body.locator('section[aria-label="You might also like"], section:has-text("You might also like")').first();
  const sectionVisible = await section.isVisible().catch(() => false);

  if (sectionVisible) {
    const contentBox = await content.boundingBox();
    const sectionBox = await section.boundingBox();
    if (contentBox && sectionBox) {
      expect(sectionBox.y).toBeGreaterThanOrEqual(contentBox.y + contentBox.height - 2);
    }
  }

  const bodyHtml = await body.evaluate((el) => el.innerHTML);
  const contentIndex = bodyHtml.indexOf('blog-content');
  const sectionIndex = bodyHtml.indexOf('You might also like');
  if (sectionIndex !== -1) expect(sectionIndex).toBeGreaterThan(contentIndex);
});
