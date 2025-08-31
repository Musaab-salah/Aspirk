import { test, expect } from '@playwright/test'

test.describe('Shipping Form E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to request summary page with some parts selected
    await page.goto('/request-summary?parts=1,2&brand=Toyota&model=Corolla&year=2016')
  })

  test('should display shipping form correctly', async ({ page }) => {
    // Check if shipping form is visible
    await expect(page.getByText('معلومات الشحن')).toBeVisible()
    await expect(page.getByText('طريقة الشحن *')).toBeVisible()
    await expect(page.getByText('دولة الوجهة *')).toBeVisible()
    
    // Check if radio buttons are present
    await expect(page.getByLabel('الشحن الجوي')).toBeVisible()
    await expect(page.getByLabel('الشحن البري')).toBeVisible()
    
    // Check if country dropdown is present
    await expect(page.getByRole('button', { name: /اختر دولة الوجهة/ })).toBeVisible()
  })

  test('should allow selecting shipping method', async ({ page }) => {
    // Select air shipping
    await page.getByLabel('الشحن الجوي').check()
    await expect(page.getByLabel('الشحن الجوي')).toBeChecked()
    await expect(page.getByLabel('الشحن البري')).not.toBeChecked()
    
    // Select land shipping
    await page.getByLabel('الشحن البري').check()
    await expect(page.getByLabel('الشحن البري')).toBeChecked()
    await expect(page.getByLabel('الشحن الجوي')).not.toBeChecked()
  })

  test('should open country dropdown and allow searching', async ({ page }) => {
    // Click on country dropdown
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    
    // Check if search input is visible
    await expect(page.getByPlaceholder('ابحث عن دولة...')).toBeVisible()
    
    // Search for a country
    await page.getByPlaceholder('ابحث عن دولة...').fill('مصر')
    
    // Check if Egypt is visible in results
    await expect(page.getByText('مصر')).toBeVisible()
  })

  test('should select country and show shipping cost', async ({ page }) => {
    // Select air shipping
    await page.getByLabel('الشحن الجوي').check()
    
    // Open country dropdown and select Egypt
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('مصر').click()
    
    // Check if shipping cost is displayed
    await expect(page.getByText('معلومات الشحن')).toBeVisible()
    await expect(page.getByText('تكلفة الشحن: 85 AED')).toBeVisible()
    await expect(page.getByText('الوقت المتوقع: 3 يوم')).toBeVisible()
  })

  test('should show error for unsupported shipping method', async ({ page }) => {
    // Select land shipping
    await page.getByLabel('الشحن البري').check()
    
    // Open country dropdown and select Nigeria (only supports air)
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('نيجيريا').click()
    
    // Check if error message is displayed
    await expect(page.getByText('طريقة الشحن المختارة غير متوفرة للدولة المحددة')).toBeVisible()
  })

  test('should validate form before submission', async ({ page }) => {
    // Fill customer information
    await page.getByLabel('الاسم الكامل *').fill('أحمد محمد')
    await page.getByLabel('البريد الإلكتروني *').fill('ahmed@example.com')
    await page.getByLabel('رقم الهاتف *').fill('+971501234567')
    
    // Try to submit without selecting shipping method
    await page.getByRole('button', { name: 'إرسال الطلب' }).click()
    
    // Check if validation error is shown
    await expect(page.getByText('Please select a shipping method.')).toBeVisible()
  })

  test('should successfully submit order with shipping information', async ({ page }) => {
    // Fill customer information
    await page.getByLabel('الاسم الكامل *').fill('أحمد محمد')
    await page.getByLabel('البريد الإلكتروني *').fill('ahmed@example.com')
    await page.getByLabel('رقم الهاتف *').fill('+971501234567')
    
    // Select shipping method and country
    await page.getByLabel('الشحن الجوي').check()
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('مصر').click()
    
    // Submit the form
    await page.getByRole('button', { name: 'إرسال الطلب' }).click()
    
    // Check if redirected to success page
    await expect(page).toHaveURL('/request-success')
  })

  test('should show shipping information in order summary', async ({ page }) => {
    // Select shipping method and country
    await page.getByLabel('الشحن الجوي').check()
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('مصر').click()
    
    // Check if shipping information appears in the summary
    await expect(page.getByText('معلومات الشحن')).toBeVisible()
    await expect(page.getByText('طريقة الشحن:')).toBeVisible()
    await expect(page.getByText('الشحن الجوي')).toBeVisible()
    await expect(page.getByText('دولة الوجهة:')).toBeVisible()
    await expect(page.getByText('مصر')).toBeVisible()
  })

  test('should filter countries based on shipping method', async ({ page }) => {
    // Select land shipping
    await page.getByLabel('الشحن البري').check()
    
    // Open country dropdown
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    
    // Nigeria should be disabled (only supports air)
    const nigeriaButton = page.getByText('نيجيريا').locator('..')
    await expect(nigeriaButton).toHaveClass(/opacity-50/)
    
    // Egypt should be enabled (supports both)
    const egyptButton = page.getByText('مصر').locator('..')
    await expect(egyptButton).not.toHaveClass(/opacity-50/)
  })

  test('should calculate different shipping costs for different methods', async ({ page }) => {
    // Select air shipping and Egypt
    await page.getByLabel('الشحن الجوي').check()
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('مصر').click()
    
    // Check air shipping cost
    await expect(page.getByText('تكلفة الشحن: 85 AED')).toBeVisible()
    
    // Switch to land shipping
    await page.getByLabel('الشحن البري').check()
    
    // Check land shipping cost (should be different)
    await expect(page.getByText('تكلفة الشحن: 60 AED')).toBeVisible()
  })
})
