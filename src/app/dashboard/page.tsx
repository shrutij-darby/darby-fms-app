'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { VerticalList } from '@/components/vertical-list';

// Dynamically import the ChartWidget to avoid SSR issues
const ChartWidgetDynamic = dynamic(
  () => import('@/components/chart-widget').then((mod) => mod.ChartWidget),
  { ssr: false }
)

// Sample data for the charts
const monthlyRevenueData = {
  series: [
    {
      name: 'Revenue',
      data: [12500, 19000, 17500, 21000, 19500, 23000, 26000, 28000],
    },
    {
      name: 'Expenses',
      data: [8500, 12000, 11000, 12500, 11800, 13500, 15000, 16000],
    },
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
};

const categoryPerformanceData = {
  series: [
    {
      name: 'Sales',
      data: [350, 420, 380, 450, 520, 480, 550],
    },
  ],
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

const customerSegmentationData = {
  series: [35, 25, 20, 12, 8],
  labels: ['New Customers', 'Returning Customers', 'VIP', 'Inactive', 'Churned'],
};

const regionalSalesData = {
  series: [
    {
      name: 'North',
      data: [120, 140, 130, 150, 145, 160, 170, 180],
    },
    {
      name: 'South',
      data: [90, 110, 105, 115, 120, 130, 140, 150],
    },
    {
      name: 'East',
      data: [80, 90, 85, 95, 100, 110, 120, 125],
    },
    {
      name: 'West',
      data: [100, 120, 115, 125, 130, 140, 150, 155],
    },
  ],
  categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
};

const productPerformanceData = {
  series: [
    {
      name: 'Product A',
      data: [30, 40, 35, 50, 49, 60, 70, 91],
    },
    {
      name: 'Product B',
      data: [20, 35, 40, 30, 49, 55, 65, 75],
    },
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
};

// This is a client component that handles search params
export default function DashboardPageClient() {
  // If you need to use search params, uncomment and use this:
  // const searchParams = useSearchParams();
  // const filter = searchParams.get('filter') || 'default';
  
  return <DashboardPageContent />;
}

// Move the existing DashboardPage content to a separate component
function DashboardPageContent() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Overview of your business performance</p>
        </div>
        
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue vs Expenses */}
       
            <ChartWidgetDynamic
              title="Revenue vs Expenses"
              description="Last 8 months"
              chartType="line"
              chartData={monthlyRevenueData.series}
              chartOptions={{
                chart: {
                  id: 'revenue-expenses-chart',
                  toolbar: {
                    show: true,
                  },
                },
                stroke: {
                  width: [3, 3],
                  curve: 'smooth',
                },
                xaxis: {
                  categories: monthlyRevenueData.categories,
                },
                yaxis: {
                  labels: {
                    formatter: (value: number) => `$${value.toLocaleString()}`,
                  },
                },
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  offsetX: 0
                },
                tooltip: {
                  y: {
                    formatter: (value) => `$${value.toLocaleString()}`,
                  },
                },
                colors: ['#10B981', '#EF4444'],
              }}
            />
    

        {/* Customer Segmentation */}
       
            <ChartWidgetDynamic
              title="Customer Segmentation"
              description="Last 8 months"
              chartType="donut"
              chartData={customerSegmentationData.series}
              chartOptions={{
                labels: ['New Customers', 'Returning Customers', 'Wholesale', 'VIP', 'Inactive'],
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%',
                    },
                  },
                },
                legend: {
                  position: 'bottom',
                },
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
              }}
            />
 
 <ChartWidgetDynamic
              title="Customer Segmentation"
              description="Last 8 months"
              chartType="pie"
              chartData={customerSegmentationData.series}
              chartOptions={{
                labels: ['New Customers', 'Returning Customers', 'Wholesale', 'VIP', 'Inactive'],
                plotOptions: {
                  pie: {
                    donut: {
                      size: '65%',
                    },
                  },
                },
                legend: {
                  position: 'bottom',
                },
                colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
              }}
            />
 
        {/* Weekly Sales Performance */}

            <ChartWidgetDynamic
              chartType="bar"
              title="Weekly Sales Performance"
              description="Last 8 months"
              chartData={[
                {
                  name: 'Product A',
                  data: [30, 40, 45, 50, 49, 60, 70, 91]
                },
                {
                  name: 'Product B',
                  data: [20, 35, 40, 30, 49, 55, 65, 75]
                },
                {
                  name: 'Product C',
                  data: [10, 25, 30, 20, 35, 45, 55, 65]
                }
              ]}
              chartOptions={{
                chart: {
                  type: 'bar',
                  height: 350,
                  stacked: true,
                  stackType: '100%',
                  toolbar: {
                    show: true
                  }
                },
                plotOptions: {
                  bar: {
                    horizontal: false, 
                    columnWidth: '60%',
                    borderRadius: 4,
                    dataLabels: {
                      total: {
                        enabled: true,
                        style: {
                          fontSize: '13px',
                          fontWeight: 'bold'
                        }
                      }
                    }
                  },
                },
                series: [
                  {
                    name: 'Product A',
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                  },
                  {
                    name: 'Product B',
                    data: [20, 35, 40, 30, 49, 55, 65, 75]
                  },
                  {
                    name: 'Product C',
                    data: [10, 25, 30, 20, 35, 45, 55, 65]
                  }
                ],
                xaxis: {
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                  title: {
                    text: 'Month'
                  }
                },
                yaxis: {
                  title: {
                    text: 'Sales'
                  },
                  labels: {
                    formatter: (value: number) => `$${value}K`
                  }
                },
                tooltip: {
                  y: {
                    formatter: (value: number) => `$${value}K`
                  }
                },
                fill: {
                  opacity: 1
                },
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  offsetX: 0
                },
                dataLabels: {
                  enabled: false 
                }
              }}
            />


        {/* Regional Sales */}

            <ChartWidgetDynamic
              title="Regional Sales Performance"
              description="Last 8 months"
              chartType="area"
              chartData={regionalSalesData.series}
              chartOptions={{
                xaxis: {
                  categories: ['North', 'South', 'East', 'West', 'Central'],
                },
                yaxis: {
                  labels: {
                    formatter: (value: number) => `$${value.toLocaleString()}`,
                  },
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    opacityFrom: 0.6,
                    opacityTo: 0.1,
                  },
                },
              }}
            />


        {/* Multi-Axis Line Chart */}
            <ChartWidgetDynamic
              chartType="line"
              title="Revenue vs Units Sold vs Profit Margin"
              description="Last 8 months comparison"
              chartData={[
                {
                  name: 'Revenue',
                  type: 'line',
                  data: [15000, 19000, 17500, 21000, 19500, 23000, 26000, 28000]
                },
                {
                  name: 'Units Sold',
                  type: 'column',
                  data: [120, 150, 140, 160, 155, 180, 200, 220]
                },
                {
                  name: 'Profit Margin %',
                  type: 'line',
                  data: [12, 15, 14, 16, 15.5, 18, 20, 22]
                }
              ]}
              chartOptions={{
                chart: {
                  height: 350,
                  type: 'line',
                  stacked: false,
                  toolbar: {
                    show: true
                  }
                },
                stroke: {
                  width: [3, 1, 3],
                  curve: 'smooth'
                },
                plotOptions: {
                  bar: {
                    columnWidth: '50%',
                  }
                },
                xaxis: {
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
                },
                // Configure multiple y-axes
                yaxis: [
                  // First Y-Axis (Left side - Revenue)
                  {
                    title: {
                      text: "Revenue",
                      style: {
                        color: '#008FFB',
                      }
                    },
                    labels: {
                      style: {
                        colors: '#008FFB',
                      },
                      formatter: (value: number) => `$${value.toLocaleString()}`
                    },
                    axisBorder: {
                      show: true,
                      color: '#008FFB'
                    },
                    axisTicks: {
                      color: '#008FFB'
                    }
                  },
                  // Second Y-Axis (Right side - Units Sold)
                  {
                    opposite: true,
                    title: {
                      text: "Units Sold",
                      style: {
                        color: '#00E396',
                      }
                    },
                    labels: {
                      style: {
                        colors: '#00E396',
                      },
                      formatter: (value: number) => `${value} units`
                    },
                    axisBorder: {
                      show: true,
                      color: '#00E396'
                    },
                    axisTicks: {
                      color: '#00E396'
                    }
                  },
                  // Third Y-Axis (Right side - Profit Margin)
                  {
                    opposite: true,
                    show: true,
                    showAlways: true,
                    seriesName: 'Profit Margin %',
                    title: {
                      text: "Profit Margin",
                      style: {
                        color: '#FEB019',
                      }
                    },
                    labels: {
                      style: {
                        colors: '#FEB019',
                      },
                      formatter: (value: number) => `${value}%`
                    },
                    axisBorder: {
                      show: true,
                      color: '#FEB019'
                    },
                    axisTicks: {
                      color: '#FEB019'
                    },
                    min: 0,
                    max: 30
                  }
                ],
                tooltip: {
                  fixed: {
                    enabled: true,
                    position: 'topLeft',
                    offsetY: 30,
                    offsetX: 60
                  },
                  y: {
                    formatter: function(value: number, { seriesIndex }: { seriesIndex: number }) {
                      if (seriesIndex === 0) return `$${value.toLocaleString()}`;
                      if (seriesIndex === 1) return `${value} units`;
                      return `${value}%`;
                    }
                  }
                },
                colors: ['#008FFB', '#00E396', '#FEB019'],
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  offsetX: 0
                },
                markers: {
                  size: 5,
                  hover: {
                    size: 7
                  }
                }
              }}
            />
  

        {/* Quick Stats */}
        <VerticalList 
          title="Quick Stats"
          items={[
            {
              title: 'Total Revenue',
              value: '$124,563',
              change: {
                value: '+12.5% from last month',
                type: 'increase'
              }
            },
            {
              title: 'Total Orders',
              value: '1,248',
              change: {
                value: '+8.2% from last month',
                type: 'increase'
              }
            },
            {
              title: 'Avg. Order Value',
              value: '$99.81',
              change: {
                value: '+4.3% from last month',
                type: 'increase'
              }
            }
          ]}
        />
      </div>
    </div>
  );
}
