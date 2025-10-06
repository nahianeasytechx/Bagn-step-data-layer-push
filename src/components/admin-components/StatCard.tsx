// components/stats/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { motion } from "motion/react";

type StatCardProps = {
  title: string;
  value: string | number | null | ReactNode;
  iconbg?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

const StatCard = ({ title, value, icon, iconbg, onClick }: StatCardProps) => {
  return (
    <motion.div
    whileHover={{scale : 1.02}}
    className="hover:shadow-xl cursor-pointer"

    >
      <Card
        onClick={onClick}
        className={`admin-card ${onClick ? "cursor-pointer hover:bg-gray-50 transition" : ""}`}
      >
        <CardHeader>
          <CardTitle className="text-left">{title}</CardTitle>
        </CardHeader>
        <div className="flex justify-between items-center">
          <CardContent className="text-3xl font-bold text-black text-left">
            {value ?? "-"}
          </CardContent>
          {icon && (
            <CardContent className={`ml-2 mr-8 border p-4 rounded-full ${iconbg}`}>
              {icon}
            </CardContent>
          )}
        </div>
      </Card>
    </motion.div>

  );
};

export default StatCard;
