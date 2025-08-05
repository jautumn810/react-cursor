"use client"

import { useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CheckoutFormProps {
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  shippingMethod: string
  items: any[]
  onSuccess: () => void
}

export function CheckoutForm({ shippingAddress, shippingMethod, items, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError("")

    // Validate shipping address
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter(field => !shippingAddress[field as keyof typeof shippingAddress])
    
    if (missingFields.length > 0) {
      setError("Please fill in all required shipping information")
      setIsProcessing(false)
      return
    }

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment failed")
        setIsProcessing(false)
        return
      }

      const { paymentIntent, error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setIsProcessing(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Create order
        const orderData = {
          shippingAddress,
          paymentIntentId: paymentIntent.id,
          shippingMethod,
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }

        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create order')
        }

        toast({
          title: "Payment successful!",
          description: "Your order has been placed successfully.",
        })

        onSuccess()
      } else {
        setError("Payment was not successful. Please try again.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError(error instanceof Error ? error.message : "Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Button 
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="h-5 w-5 mr-2" />
            Pay Now
          </>
        )}
      </Button>
    </form>
  )
} 