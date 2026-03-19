/** @format */

import { render } from '@testing-library/react'
import { Providers } from '@/views/globalComponents/Providers'

export const renderWithProviders = (children: React.ReactNode) => {
  return render(<Providers>{children}</Providers>)
}
