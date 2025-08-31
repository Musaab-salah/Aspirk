import { NextRequest, NextResponse } from 'next/server'
import { validateShippingFields, calculateShippingCost, COUNTRIES } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerInfo,
      selectedParts,
      carInfo,
      totalEstimatedPrice,
      shippingMethod,
      destinationCountry,
      notes
    } = body

    // Server-side validation
    const validation = validateShippingFields(shippingMethod, destinationCountry)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          validation: validation.errors 
        },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!customerInfo?.name || !customerInfo?.email || !customerInfo?.phone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required customer information' 
        },
        { status: 400 }
      )
    }

    if (!selectedParts || selectedParts.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No spare parts selected' 
        },
        { status: 400 }
      )
    }

    // Calculate shipping cost
    const shippingCost = calculateShippingCost(shippingMethod, destinationCountry)
    
    if (!shippingCost.isAvailable) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Selected shipping method is not available for the chosen country' 
        },
        { status: 400 }
      )
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order object
    const order = {
      id: `order-${Date.now()}`,
      orderNumber,
      customerId: `customer-${Date.now()}`,
      carId: `car-${Date.now()}`,
      status: 'pending' as const,
      totalAmount: totalEstimatedPrice,
      shippingCost: shippingCost.baseCost,
      currency: 'AED' as const,
      shippingMethod,
      destinationCountry,
      notes,
      createdAt: new Date(),
      updatedAt: new Date(),
      customer: {
        id: `customer-${Date.now()}`,
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      car: {
        id: `car-${Date.now()}`,
        brandId: '1',
        modelId: '1',
        year: parseInt(carInfo.year) || 2020,
        brand: { id: '1', name: carInfo.brand || 'Toyota', nameAr: 'تويوتا' },
        model: { 
          id: '1', 
          brandId: '1', 
          name: carInfo.model || 'Corolla', 
          nameAr: 'كورولا', 
          years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] 
        },
      },
      items: selectedParts.map((partId: string, index: number) => ({
        id: `item-${Date.now()}-${index}`,
        orderId: `order-${Date.now()}`,
        sparePartId: partId,
        quantity: 1,
        requestedPrice: 0,
        approvedPrice: 0,
        sparePart: {
          id: partId,
          name: `Spare Part ${partId}`,
          nameAr: `قطعة غيار ${partId}`,
          category: 'Engine Parts',
          categoryAr: 'قطع المحرك',
          compatibleCars: ['1', '2', '3'],
          price: 100,
          currency: 'AED' as const,
          isAvailable: true,
        }
      }))
    }

    // In a real application, you would save this to a database
    console.log('Order created:', order)

    return NextResponse.json({
      success: true,
      data: {
        order,
        shippingInfo: {
          method: shippingMethod,
          country: COUNTRIES.find(c => c.code === destinationCountry)?.nameAr,
          cost: shippingCost.baseCost,
          estimatedDays: shippingCost.estimatedDays
        }
      },
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')

    // Mock data - in real app this would come from database
    const mockOrders = [
      {
        id: '1',
        orderNumber: 'ORD-001',
        customerId: '1',
        carId: '1',
        status: 'pending',
        totalAmount: 450,
        shippingCost: 85,
        currency: 'AED',
        shippingMethod: 'air',
        destinationCountry: 'EG',
        notes: 'Need urgent delivery',
        adminNotes: '',
        createdAt: new Date('2024-01-15T10:30:00'),
        updatedAt: new Date('2024-01-15T10:30:00'),
        customer: {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+971501234567',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        car: {
          id: '1',
          brandId: '1',
          modelId: '1',
          year: 2016,
          brand: { id: '1', name: 'Toyota', nameAr: 'تويوتا' },
          model: { id: '1', brandId: '1', name: 'Corolla', nameAr: 'كورولا', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
        },
        items: [],
      },
      {
        id: '2',
        orderNumber: 'ORD-002',
        customerId: '2',
        carId: '2',
        status: 'approved',
        totalAmount: 320,
        shippingCost: 150,
        currency: 'AED',
        shippingMethod: 'air',
        destinationCountry: 'NG',
        notes: 'Standard delivery is fine',
        adminNotes: 'Approved after price verification',
        createdAt: new Date('2024-01-14T15:45:00'),
        updatedAt: new Date('2024-01-14T16:20:00'),
        customer: {
          id: '2',
          name: 'سارة أحمد',
          email: 'sara@example.com',
          phone: '+971507654321',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        car: {
          id: '2',
          brandId: '2',
          modelId: '4',
          year: 2018,
          brand: { id: '2', name: 'Hyundai', nameAr: 'هيونداي' },
          model: { id: '4', brandId: '2', name: 'Accent', nameAr: 'أكسنت', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
        },
        items: [],
      },
      {
        id: '3',
        orderNumber: 'ORD-003',
        customerId: '3',
        carId: '3',
        status: 'rejected',
        totalAmount: 280,
        shippingCost: 100,
        currency: 'AED',
        shippingMethod: 'air',
        destinationCountry: 'KE',
        notes: 'Budget constraint',
        adminNotes: 'Rejected due to unavailability of parts',
        createdAt: new Date('2024-01-13T09:15:00'),
        updatedAt: new Date('2024-01-13T14:30:00'),
        customer: {
          id: '3',
          name: 'محمد علي',
          email: 'mohamed@example.com',
          phone: '+971509876543',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        car: {
          id: '3',
          brandId: '3',
          modelId: '7',
          year: 2019,
          brand: { id: '3', name: 'Nissan', nameAr: 'نيسان' },
          model: { id: '7', brandId: '3', name: 'Altima', nameAr: 'ألتيما', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
        },
        items: [],
      },
      {
        id: '4',
        orderNumber: 'ORD-004',
        customerId: '1',
        carId: '4',
        status: 'pending',
        totalAmount: 550,
        shippingCost: 75,
        currency: 'AED',
        shippingMethod: 'land',
        destinationCountry: 'SA',
        notes: 'Prefer land shipping for cost',
        adminNotes: '',
        createdAt: new Date('2024-01-16T08:20:00'),
        updatedAt: new Date('2024-01-16T08:20:00'),
        customer: {
          id: '1',
          name: 'أحمد محمد',
          email: 'ahmed@example.com',
          phone: '+971501234567',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        car: {
          id: '4',
          brandId: '1',
          modelId: '2',
          year: 2020,
          brand: { id: '1', name: 'Toyota', nameAr: 'تويوتا' },
          model: { id: '2', brandId: '1', name: 'Camry', nameAr: 'كامري', years: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] },
        },
        items: [],
      },
    ]

    let filteredOrders = mockOrders

    // Filter by status if provided
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    // Filter by customer ID if provided (for user's own orders)
    if (customerId) {
      filteredOrders = filteredOrders.filter(order => order.customerId === customerId)
    }

    return NextResponse.json({
      success: true,
      data: filteredOrders,
      message: 'Orders retrieved successfully'
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
