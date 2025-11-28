// Truck（トラック）
export type TruckType = 'small' | 'medium' | 'large'
export type TruckStatus = 'available' | 'in_use' | 'maintenance'

export type Truck = {
  id: string
  plateNumber: string // ナンバープレート
  capacity: number // 積載量(kg)
  type: TruckType
  status: TruckStatus
  createdAt: Date
  updatedAt: Date
}

export type CreateTruckInput = Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTruckInput = Partial<CreateTruckInput>
