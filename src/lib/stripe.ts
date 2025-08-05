import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const formatAmountForStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalAmount = ''
  for (const part of parts) {
    if (part.type === 'integer') {
      zeroDecimalAmount += part.value
    }
  }
  return parseInt(zeroDecimalAmount)
}

export const formatAmountFromStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalAmount = ''
  for (const part of parts) {
    if (part.type === 'integer') {
      zeroDecimalAmount += part.value
    }
  }
  return parseInt(zeroDecimalAmount)
} 