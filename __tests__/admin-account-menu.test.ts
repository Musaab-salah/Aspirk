import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import AdminDashboard from '../app/admin/page'

// Mock the AdminLogin component
jest.mock('../components/AdminLogin', () => {
  return function MockAdminLogin({ onLogin, isLoading, error }: any) {
    return (
      <div data-testid="admin-login">
        <button onClick={() => onLogin('admin', 'password')}>Login</button>
        {isLoading && <span>Loading...</span>}
        {error && <span>Error: {error}</span>}
      </div>
    )
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = jest.fn()

describe('Admin Dashboard Account Menu', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('true')
    localStorageMock.getItem.mockReturnValueOnce('admin')
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true })
    })
  })

  it('should render the account menu button when authenticated', async () => {
    render(<AdminDashboard />)
    
    // Wait for authentication to complete
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    // Check that the account menu button is present
    const accountButton = screen.getByRole('button', { name: /admin/i })
    expect(accountButton).toBeInTheDocument()
  })

  it('should open account dropdown when clicked', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    
    // Click the account button
    fireEvent.click(accountButton)
    
    // Check that the dropdown menu is visible
    await waitFor(() => {
      expect(screen.getByText('الملف الشخصي')).toBeInTheDocument()
      expect(screen.getByText('الإعدادات')).toBeInTheDocument()
      expect(screen.getByText('الأمان')).toBeInTheDocument()
      expect(screen.getByText('المساعدة')).toBeInTheDocument()
      expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument()
    })
  })

  it('should close account dropdown when clicking outside', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    
    // Open the dropdown
    fireEvent.click(accountButton)
    
    // Verify it's open
    await waitFor(() => {
      expect(screen.getByText('الملف الشخصي')).toBeInTheDocument()
    })
    
    // Click outside (on the body)
    fireEvent.mouseDown(document.body)
    
    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByText('الملف الشخصي')).not.toBeInTheDocument()
    })
  })

  it('should handle profile action when clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('الملف الشخصي')).toBeInTheDocument()
    })
    
    const profileButton = screen.getByText('الملف الشخصي')
    fireEvent.click(profileButton)
    
    // Check that the action was logged
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to profile page')
    
    // Check that the dropdown closed
    await waitFor(() => {
      expect(screen.queryByText('الملف الشخصي')).not.toBeInTheDocument()
    })
    
    consoleSpy.mockRestore()
  })

  it('should handle settings action when clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('الإعدادات')).toBeInTheDocument()
    })
    
    const settingsButton = screen.getByText('الإعدادات')
    fireEvent.click(settingsButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to settings page')
    
    consoleSpy.mockRestore()
  })

  it('should handle security action when clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('الأمان')).toBeInTheDocument()
    })
    
    const securityButton = screen.getByText('الأمان')
    fireEvent.click(securityButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to security page')
    
    consoleSpy.mockRestore()
  })

  it('should handle help action when clicked', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('المساعدة')).toBeInTheDocument()
    })
    
    const helpButton = screen.getByText('المساعدة')
    fireEvent.click(helpButton)
    
    expect(consoleSpy).toHaveBeenCalledWith('Navigate to help page')
    
    consoleSpy.mockRestore()
  })

  it('should handle logout action when clicked', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('تسجيل الخروج')).toBeInTheDocument()
    })
    
    const logoutButton = screen.getByText('تسجيل الخروج')
    fireEvent.click(logoutButton)
    
    // Check that logout was called (should show login form)
    await waitFor(() => {
      expect(screen.getByTestId('admin-login')).toBeInTheDocument()
    })
  })

  it('should display user information in dropdown header', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    await waitFor(() => {
      expect(screen.getByText('admin@admin.com')).toBeInTheDocument()
      expect(screen.getByText('مدير النظام')).toBeInTheDocument()
    })
  })

  it('should have proper ARIA attributes for accessibility', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    
    // Check initial ARIA state
    expect(accountButton).toHaveAttribute('aria-expanded', 'false')
    expect(accountButton).toHaveAttribute('aria-haspopup', 'true')
    
    // Click to open
    fireEvent.click(accountButton)
    
    // Check expanded state
    expect(accountButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('should close dropdown when escape key is pressed', async () => {
    render(<AdminDashboard />)
    
    await waitFor(() => {
      expect(screen.getByText('admin')).toBeInTheDocument()
    })

    const accountButton = screen.getByRole('button', { name: /admin/i })
    fireEvent.click(accountButton)
    
    // Verify it's open
    await waitFor(() => {
      expect(screen.getByText('الملف الشخصي')).toBeInTheDocument()
    })
    
    // Press escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    
    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByText('الملف الشخصي')).not.toBeInTheDocument()
    })
  })
})
