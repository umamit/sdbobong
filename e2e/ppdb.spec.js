const { test, expect } = require('@playwright/test');

test.describe('SDN Bobong Public Portals E2E Tests', () => {

  test('should navigate to Grades portal, submit invalid NISN, and show error message', async ({ page }) => {
    // Go to Grades lookup page
    await page.goto('/nilai');

    // Verify page header title is rendered
    await expect(page.locator('h1')).toContainText('Portal Rapor Digital');

    // Fill in invalid NISN and birthdate
    await page.fill('#nisn', '9999999999');
    await page.fill('#birthDate', '2015-12-31');

    // Wait for API response then expect error message to appear
    await Promise.all([
      page.waitForResponse(resp => resp.url().includes('/api/students/grades') && resp.status() === 404),
      page.click('button[type="submit"]'),
    ]);

    // Expect an error alert to be rendered due to invalid data
    const errorAlert = page.locator('text=tidak ditemukan');
    await expect(errorAlert).toBeVisible();
  });

  test('should navigate to PPDB info page and check active accordion sections', async ({ page }) => {
    // Go to PPDB Info portal page
    await page.goto('/ppdb');

    // Check main banner
    await expect(page.locator('h1')).toBeVisible();

    // Verify FAQ accordion click triggers expansion
    const firstFaqButton = page.locator('button:has-text("Bagaimana jika")').first();
    if (await firstFaqButton.count() > 0) {
      await firstFaqButton.click();
      
      // Ensure the corresponding answer text becomes visible
      await expect(page.locator('text=Calon siswa yang berusia kurang')).toBeVisible();
    }
  });

});
