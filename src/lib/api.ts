import axios from "axios";

export const getCustomers = async () => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customers`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch customers", error);
    throw new Error("Failed to fetch customers");
  }
};