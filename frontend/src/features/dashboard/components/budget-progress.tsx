import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'



export function BudgetProgress() {
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch budget data
        const budgetResponse = await fetch('http://localhost:5000/budget')
        const budgets = await budgetResponse.json()
        
        // Fetch forecast data to get spending amounts
        const forecastResponse = await fetch('http://localhost:5000/forecast')
        const forecastData = await forecastResponse.json()
        
        // Calculate totals
        const totalBudgetAmount = Object.values(budgets).reduce((sum: number, amount: any) => sum + (Number(amount) || 0), 0)
        
        let totalSpentAmount = 0
        Object.entries(forecastData.forecast).forEach(([, data]: [string, any]) => {
          totalSpentAmount += data.spent_so_far || 0
        })
        
        setTotalBudget(totalBudgetAmount)
        setTotalSpent(totalSpentAmount)
        
      } catch (error) {
        console.error('Error fetching budget/spending data:', error)
        // Set mock data as fallback
        setTotalBudget(4200) // Total of all categories
        setTotalSpent(3560)  // Total spending
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = totalSpent > totalBudget

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className='h-6 bg-gray-200 rounded animate-pulse'></div>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='h-8 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-4 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-3 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className='pb-4'>
        <CardTitle className='text-xl font-medium'>Monthly Budget Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='text-3xl font-bold'>
              ${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className='text-lg text-muted-foreground'>
              / ${totalBudget.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          
          <Progress 
            value={Math.min(percentage, 100)} 
            className={cn(
              'w-full h-4',
              isOverBudget && '[&>div]:bg-red-500'
            )}
          />
          
          <div className='flex justify-between items-center'>
            <p className={cn(
              'text-sm',
              isOverBudget ? 'text-red-600 font-semibold' : 'text-muted-foreground'
            )}>
              {isOverBudget 
                ? `Over budget by $${(totalSpent - totalBudget).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                : `$${(totalBudget - totalSpent).toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining`
              }
            </p>
            <p className='text-sm text-muted-foreground'>
              {percentage.toFixed(1)}% used
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}