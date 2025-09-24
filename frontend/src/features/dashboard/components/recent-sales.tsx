import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Transaction {
  transaction_id: string
  merchant_name: string
  amount: number
  category: string[]
  date: string
}

function getInitials(merchantName: string): string {
  return merchantName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export function RecentSales() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:5000/transactions')
        const data = await response.json()
        
        // Get the latest 5 transactions and sort by date
        const sortedTransactions = data.transactions
          .sort((a: Transaction, b: Transaction) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
          
        setTransactions(sortedTransactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        // Fallback to empty array if error
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (loading) {
    return (
      <div className='space-y-8'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='flex items-center gap-4'>
            <div className='h-9 w-9 rounded-full bg-gray-200 animate-pulse' />
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-2'>
                <div className='h-4 w-24 bg-gray-200 rounded animate-pulse' />
                <div className='h-3 w-32 bg-gray-200 rounded animate-pulse' />
              </div>
              <div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className='flex items-center justify-center h-32 text-muted-foreground'>
        <p className='text-sm'>No recent transactions found</p>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {transactions.map((transaction) => (
        <div key={transaction.transaction_id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarFallback className='text-xs font-medium'>
              {getInitials(transaction.merchant_name)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {transaction.merchant_name}
              </p>
              <p className='text-muted-foreground text-sm'>
                {transaction.category[0]} • {formatDate(transaction.date)}
              </p>
            </div>
            <div className='font-medium text-red-600'>
              -${transaction.amount.toLocaleString('en-US', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
