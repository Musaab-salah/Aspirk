import { test, expect } from '@playwright/test'

test.describe('Admin and User Order Flow', () => {
  test('admin should be able to view and manage orders', async ({ page }) => {
    // Navigate to admin orders page
    await page.goto('/admin/orders')
    
    // Check if admin orders page is loaded
    await expect(page.getByText('إدارة الطلبات')).toBeVisible()
    await expect(page.getByText('مراجعة وإدارة طلبات العملاء')).toBeVisible()
    
    // Check if filters are present
    await expect(page.getByText('تصفية حسب الحالة:')).toBeVisible()
    await expect(page.getByRole('combobox')).toBeVisible()
    
    // Check if orders table is present
    await expect(page.getByText('الطلبات')).toBeVisible()
    
    // Check if order actions are present for pending orders
    const pendingOrder = page.locator('tr').filter({ hasText: 'قيد المراجعة' }).first()
    if (await pendingOrder.count() > 0) {
      await expect(pendingOrder.locator('button[title*="approve"]')).toBeVisible()
      await expect(pendingOrder.locator('button[title*="reject"]')).toBeVisible()
    }
  })

  test('user should be able to create new request', async ({ page }) => {
    // Navigate to new request page
    await page.goto('/new-request')
    
    // Check if new request form is loaded
    await expect(page.getByText('إنشاء طلب جديد')).toBeVisible()
    await expect(page.getByText('معلومات العميل')).toBeVisible()
    await expect(page.getByText('معلومات الشحن')).toBeVisible()
    
    // Fill customer information
    await page.getByLabel('الاسم الكامل *').fill('أحمد محمد')
    await page.getByLabel('البريد الإلكتروني *').fill('ahmed@example.com')
    await page.getByLabel('رقم الهاتف *').fill('+971501234567')
    
    // Select shipping method
    await page.getByLabel('الشحن الجوي').check()
    
    // Select destination country
    await page.getByRole('button', { name: /اختر دولة الوجهة/ }).click()
    await page.getByText('مصر').click()
    
    // Submit the form
    await page.getByRole('button', { name: 'إرسال الطلب' }).click()
    
    // Should redirect to my orders page
    await expect(page).toHaveURL('/my-orders')
  })

  test('user should be able to view their orders', async ({ page }) => {
    // Navigate to user orders page
    await page.goto('/my-orders')
    
    // Check if user orders page is loaded
    await expect(page.getByText('طلباتي')).toBeVisible()
    await expect(page.getByText('عرض وإدارة طلبات قطع الغيار')).toBeVisible()
    
    // Check if new request button is present
    await expect(page.getByRole('button', { name: 'طلب جديد' })).toBeVisible()
    
    // Check if orders list is present
    await expect(page.getByText('تاريخ الطلبات')).toBeVisible()
  })

  test('user should see order status updates', async ({ page }) => {
    // Navigate to user orders page
    await page.goto('/my-orders')
    
    // Check if order statuses are displayed correctly
    const statusElements = page.locator('[class*="bg-"]')
    
    // Should have status badges
    await expect(statusElements.first()).toBeVisible()
  })

  test('admin should be able to approve order', async ({ page }) => {
    // Navigate to admin orders page
    await page.goto('/admin/orders')
    
    // Find a pending order and click approve
    const pendingOrder = page.locator('tr').filter({ hasText: 'قيد المراجعة' }).first()
    if (await pendingOrder.count() > 0) {
      const approveButton = pendingOrder.locator('button').filter({ hasText: '' }).first()
      await approveButton.click()
      
      // Should show success message or update status
      await expect(page.locator('tr').filter({ hasText: 'تمت الموافقة' })).toBeVisible()
    }
  })

  test('admin should be able to reject order', async ({ page }) => {
    // Navigate to admin orders page
    await page.goto('/admin/orders')
    
    // Find a pending order and click reject
    const pendingOrder = page.locator('tr').filter({ hasText: 'قيد المراجعة' }).first()
    if (await pendingOrder.count() > 0) {
      const rejectButton = pendingOrder.locator('button').filter({ hasText: '' }).nth(1)
      await rejectButton.click()
      
      // Should show success message or update status
      await expect(page.locator('tr').filter({ hasText: 'مرفوض' })).toBeVisible()
    }
  })

  test('admin should be able to filter orders', async ({ page }) => {
    // Navigate to admin orders page
    await page.goto('/admin/orders')
    
    // Select pending filter
    await page.getByRole('combobox').selectOption('pending')
    
    // Should only show pending orders
    const rows = page.locator('tbody tr')
    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i)
      await expect(row.locator('text=قيد المراجعة')).toBeVisible()
    }
    
    // Select approved filter
    await page.getByRole('combobox').selectOption('approved')
    
    // Should only show approved orders
    for (let i = 0; i < await rows.count(); i++) {
      const row = rows.nth(i)
      await expect(row.locator('text=تمت الموافقة')).toBeVisible()
    }
  })

  test('order details modal should work', async ({ page }) => {
    // Navigate to admin orders page
    await page.goto('/admin/orders')
    
    // Click on view details button
    const viewButton = page.locator('button').filter({ hasText: '' }).first()
    await viewButton.click()
    
    // Should show modal with order details
    await expect(page.locator('text=تفاصيل الطلب')).toBeVisible()
    await expect(page.locator('text=إغلاق')).toBeVisible()
    
    // Close modal
    await page.getByRole('button', { name: 'إغلاق' }).click()
    
    // Modal should be closed
    await expect(page.locator('text=تفاصيل الطلب')).not.toBeVisible()
  })
})
