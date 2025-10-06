// useTotalSales.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useTotalSales = () => {
  return useQuery({
    queryKey: ['totalSalesThisMonth'],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats/monthlyStats`);
      return data.totalSales;
    },
  });
};

export const useOrderCounts = () => {
  return useQuery({
    queryKey: ['orderCounts'],
    queryFn: async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats/orderCounts`);
      return data; // { today: 5, week: 12, month: 45 }
    },
  });
};

export const useTopProducts = () => {
    return useQuery({
      queryKey: ["topProducts"],
      queryFn: async () => {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/stats/topProduct`);
        return data; // [{ productId, _sum: { quantity }, name, image }]
      },
    });
  };

