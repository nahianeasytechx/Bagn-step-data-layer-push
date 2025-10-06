"use client";

import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ✅ Do not change this block (per your request)
const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        ...({
          drawBorder: false,
        } as any),
      },
    },
    x: {
      grid: {
        display: false,
        ...({
          drawBorder: false,
        } as any),
      },
    },
  },
};

const SalesChart = () => {
  const [view, setView] = useState<'weekly' | 'monthly'>('weekly');
  const [chartData, setChartData] = useState<ChartData<'line', number[], string>>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint =
          view === 'weekly'
            ? `${process.env.NEXT_PUBLIC_API_URL}/stats/WeeklySales`
            : `${process.env.NEXT_PUBLIC_API_URL}/stats/MonthlySales`;

        const res = await axios.get(endpoint);

        const labels = res.data.map((item: any) =>
          view === 'weekly' ? item.day : item.month
        );

        const shoes = res.data.map((item: any) => item.shoes || 0);
        const bags = res.data.map((item: any) => item.bags || 0);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Shoes',
              data: shoes,
              borderColor: 'rgb(79, 70, 229)',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Bags',
              data: bags,
              borderColor: 'rgb(236, 72, 153)',
              backgroundColor: 'rgba(236, 72, 153, 0.1)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch sales data:', error);
      }
    };

    fetchData();
  }, [view]);

  return (
    <div className="w-full h-[450px] bg-white rounded-xl border bg-card text-card-foreground shadow p-4 mt-8 mb-28 sm:mb-0">
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant={view === 'weekly' ? 'default' : 'outline'}
          onClick={() => setView('weekly')}
        >
          Weekly
        </Button>
        <Button
          variant={view === 'monthly' ? 'default' : 'outline'}
          onClick={() => setView('monthly')}
        >
          Monthly
        </Button>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
