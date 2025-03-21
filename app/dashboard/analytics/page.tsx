import AnalyticsCard from "@/components/analytics/analytic-card";
import AnalyticsChart from "@/components/analytics/analytic-chart";
import { analytics, weeklyAnalytics } from "@/server/actions/analytic-actions";
import { Box, Clock, Package, TicketX, Users } from "lucide-react";

const AnalyticsPage = async () => {
  const analyticData = await analytics();
  const weeklyAnalyticsData = await weeklyAnalytics();
  console.log(weeklyAnalyticsData);

  return (
    <section>
      {analyticData && (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 mb-10">
          <AnalyticsCard
            title="Pending Orders"
            count={analyticData.pendingOrders}
            icon={<Clock size={20} />}
            href="/dashboard/orders"
          />
          <AnalyticsCard
            title="Complete Orders"
            count={analyticData.completeOrders}
            icon={<Package size={20} />}
            href="/dashboard/orders"
          />
          <AnalyticsCard
            title="Cancel Orders"
            count={analyticData.cancelOrders}
            icon={<TicketX size={20} />}
            href="/dashboard/orders"
          />
          <AnalyticsCard
            title="Total Users"
            count={analyticData.totalUsers}
            icon={<Users size={20} />}
            href="/"
          />
          <AnalyticsCard
            title="Total Products"
            count={analyticData.totalProducts}
            icon={<Box size={20} />}
            href="/dashboard/products"
          />
        </div>
      )}
      <AnalyticsChart data={weeklyAnalyticsData!} />
    </section>
  );
};

export default AnalyticsPage;
