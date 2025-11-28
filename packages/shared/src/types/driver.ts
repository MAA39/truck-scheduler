// Driver（ドライバー）
export type DriverLicenseType = 'normal' | 'large' | 'trailer'
export type DriverStatus = 'available' | 'on_delivery' | 'off_duty'

export type Driver = {
  id: string
  name: string
  phone: string
  licenseType: DriverLicenseType
  status: DriverStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateDriverInput = Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateDriverInput = Partial<CreateDriverInput>
