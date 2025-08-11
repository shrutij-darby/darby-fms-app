'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, Filter } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'donut';

interface ChartWidgetProps {
  title?: string;
  description?: string;
  chartType: ChartType;
  chartData: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chartOptions?: ApexCharts.ApexOptions;
  showDateFilter?: boolean;
  showCustomFilter?: boolean;
  className?: string;
}

const defaultChartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: 'line',
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
    },
    fontFamily: 'Inter, sans-serif',
    background: 'transparent',
    foreColor: '#6B7280',
  },
  grid: {
    borderColor: '#E5E7EB',
    strokeDashArray: 4,
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  yaxis: {
    labels: {
      formatter: (val: number) => val.toFixed(0),
    },
  },
  tooltip: {
    theme: 'light',
    x: {
      format: 'dd MMM yyyy',
    },
  },
  legend: {
    position: 'top' as const,
    horizontalAlign: 'right' as const,
    markers: {
      width: 8,
      height: 8,
      strokeWidth: 0,
      radius: 0,
    },
  } as ApexLegend,
  responsive: [
    {
      breakpoint: 640,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          position: 'bottom' as const,
          horizontalAlign: 'center' as const,
        },
      },
    },
  ],
};

export function ChartWidget({
  title,
  description,
  chartType,
  chartData,
  chartOptions: customOptions,
  showDateFilter = false,
  showCustomFilter = false,
  className,
}: ChartWidgetProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [selectedFilter, setSelectedFilter] = React.useState<string>('');

  // Merge default options with custom options in a way that's safe for Next.js
  const options: ApexCharts.ApexOptions = React.useMemo(() => {
    // Create a new object to avoid mutating the original
    const mergedOptions = { ...defaultChartOptions };
    
    // Safely merge custom options if they exist
    if (customOptions) {
      // Handle chart options separately
      if ('chart' in customOptions) {
        mergedOptions.chart = {
          ...defaultChartOptions.chart,
          ...(customOptions.chart || {}),
          type: chartType,
        };
      }
      
      // Handle other options with proper type safety
      const customOptionKeys = Object.keys(customOptions) as Array<keyof ApexCharts.ApexOptions>;
      
      // Define a type-safe way to assign properties
      const assignOption = <K extends keyof ApexCharts.ApexOptions>(
        target: ApexCharts.ApexOptions,
        key: K,
        value: ApexCharts.ApexOptions[K]
      ) => {
        target[key] = value;
      };
      
      customOptionKeys.forEach(key => {
        if (key !== 'chart' && key in defaultChartOptions) {
          // Type-safe property assignment using our helper function
          assignOption(
            mergedOptions,
            key as keyof ApexCharts.ApexOptions,
            customOptions[key as keyof typeof customOptions]
          );
        }
      });
    }
    
    // Ensure chart type is always set
    if (!mergedOptions.chart) {
      mergedOptions.chart = { type: chartType };
    } else {
      mergedOptions.chart.type = chartType;
    }
    
    return mergedOptions;
  }, [customOptions, chartType]);

  return (
    <div className={cn('w-full rounded-lg bg-card shadow-sm overflow-hidden', className)}>
      <div className="p-4 sm:p-6">
        <div className="mb-4">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        
        {(showDateFilter || showCustomFilter) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {showDateFilter && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'w-full sm:w-[200px] justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}

            {showCustomFilter && (
              <Select onValueChange={setSelectedFilter} value={selectedFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span>Filter</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
      
      <div className="w-full h-[300px] sm:h-[400px] px-4 sm:px-6 pb-4 sm:pb-6">
        {typeof window !== 'undefined' && (
          <Chart
            options={{
              ...options,
              chart: (() => {
                // Safely access chart options to prevent params enumeration
                const chartOptions =  options.chart || {};
                return {
                  ...chartOptions,
                  type: chartType,
                  toolbar: {
                    ...(chartOptions.toolbar || {}),
                    offsetY: -5,
                    show: chartOptions.toolbar?.show !== false
                  }
                };
              })()
            }}
            series={chartData}
            type={chartType}
            height="100%"
            width="100%"
          />
        )}
      </div>
    </div>
  );
}
