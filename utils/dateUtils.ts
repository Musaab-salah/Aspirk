/**
 * Utility function to convert string dates back to Date objects
 * This is needed because JSON serialization converts Date objects to strings
 */
export function processOrderDates(order: any): any {
  return {
    ...order,
    createdAt: order.createdAt ? new Date(order.createdAt) : new Date(),
    updatedAt: order.updatedAt ? new Date(order.updatedAt) : new Date(),
    expectedShippingDate: order.expectedShippingDate ? new Date(order.expectedShippingDate) : undefined,
    actualShippingDate: order.actualShippingDate ? new Date(order.actualShippingDate) : undefined,
    deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : undefined,
    customer: {
      ...order.customer,
      createdAt: order.customer?.createdAt ? new Date(order.customer.createdAt) : new Date(),
      updatedAt: order.customer?.updatedAt ? new Date(order.customer.updatedAt) : new Date(),
    }
  }
}

/**
 * Process an array of orders to convert string dates to Date objects
 */
export function processOrdersDates(orders: any[]): any[] {
  return orders.map(processOrderDates)
}
