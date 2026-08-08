import React, { useState } from 'react';
import { BarChart3, Sparkles } from 'lucide-react';
import AnalyticsStats from '../components/analytics/AnalyticsStats';
import DateRangeSelector from '../components/analytics/DateRangeSelector';
import ParticipationChart from '../components/analytics/ParticipationChart';
import HourlyActivityChart from '../components/analytics/HourlyActivityChart';
import TokenDistributionChart from '../components/analytics/TokenDistributionChart';
import PrizeAnalytics from '../components/analytics/PrizeAnalytics';
import HighValuePrizeStats from '../components/analytics/HighValuePrizeStats';
import ReportExport from '../components/analytics/ReportExport';

export const AnalyticsPage: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('CAMPAIGN');

  return (
    <div className="space-y-8 text-left selection:bg-[#FFD700] selection:text-[#0D021A]">
      
      {/* 1. Header & Timeframe Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FFD700]/15 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D0636] border border-[#FFD700]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
            <BarChart3 className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Campaign Intelligence Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans">
            Analytics & Reports
          </h1>
          <p className="text-xs text-[#A0A0A0] max-w-xl leading-relaxed">
            Realtime performance metrics, customer participation trends, prize distribution, and hourly Diwali rush insights.
          </p>
        </div>

        {/* Date Range Selector */}
        <DateRangeSelector
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />
      </div>

      {/* 2. Analytics Summary Cards (6 Cards) */}
      <AnalyticsStats
        participants={2482}
        verified={1964}
        winners={1964}
        claimed={1732}
        pending={232}
        qrScans={3120}
      />

      {/* 3. Participation Trend & Hourly Activity Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <ParticipationChart />
        </div>
        <div className="lg:col-span-6">
          <HourlyActivityChart />
        </div>
      </div>

      {/* 4. Token Ratios & Prize Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <TokenDistributionChart />
        </div>
        <div className="lg:col-span-7">
          <PrizeAnalytics />
        </div>
      </div>

      {/* 5. ⭐ High Value Prize Activity */}
      <HighValuePrizeStats />

      {/* 6. Executive Report Export Bar */}
      <ReportExport />

    </div>
  );
};

export default AnalyticsPage;
