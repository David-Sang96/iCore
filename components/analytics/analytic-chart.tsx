"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";

type Data = {
  day: Date;
  count: number;
}[];

type AnalyticsChartProps = {
  data: Data;
};

const chartConfig = {
  order: {
    label: "Order",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const AnalyticsChart = ({ data }: AnalyticsChartProps) => {
  const today = new Date();
  const day = Number(format(today, "d"));
  const startDay = day > 7 ? day - 6 : 1;
  const formattedDate = format(today, "dd/MM/yyyy");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders Chart</CardTitle>
        <CardDescription>
          ( {startDay} {format(startDay, "EE")} - {day} {format(day, "EE")} ) ({" "}
          {formattedDate} )
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-96">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
                top: 40,
              }}
            >
              <CartesianGrid />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(value, "dd-MM-yyyy")}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="count"
                type="natural"
                stroke="black"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total orders for the last 7 days
        </div>
      </CardFooter>
    </Card>
  );
};

export default AnalyticsChart;
