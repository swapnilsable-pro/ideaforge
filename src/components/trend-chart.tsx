'use client';

import { TrendAnalysis } from '@/lib/validation/trend-research';
import styles from './trend-chart.module.css';

interface TrendChartProps {
  analysis: TrendAnalysis | null;
  isLoading?: boolean;
  onFetch?: () => void;
}

export function TrendChart({ analysis, isLoading, onFetch }: TrendChartProps) {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}>📈</div>
          <p>Fetching trend data...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p>No trend data yet</p>
          {onFetch && (
            <button onClick={onFetch} className={styles.fetchButton}>
              Analyze Trends
            </button>
          )}
        </div>
      </div>
    );
  }

  const getTrendColor = (trend: string) => {
    if (trend === 'rising') return '#10b981';
    if (trend === 'declining') return '#ef4444';
    return '#fbbf24';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'rising') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  // Calculate chart dimensions
  const maxValue = Math.max(...analysis.timelineData.map(d => d.value), 1);
  const chartHeight = 200;
  const chartWidth = 100; // percentage

  return (
    <div className={styles.container}>
      {/* Key Metrics */}
      <div className={styles.metricsGrid}>
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Keyword</div>
          <div className={styles.metricValue}>"{analysis.keyword}"</div>
        </div>
        
        <div className={styles.metric}>
          <div className={styles.metricLabel}>Trend</div>
          <div 
            className={styles.metricValue}
            style={{ color: getTrendColor(analysis.trend) }}
          >
            {getTrendIcon(analysis.trend)} {analysis.trend.toUpperCase()}
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Change</div>
          <div 
            className={styles.metricValue}
            style={{ color: getTrendColor(analysis.trend) }}
          >
            {analysis.trendPercentage > 0 ? '+' : ''}
            {analysis.trendPercentage}%
          </div>
        </div>

        <div className={styles.metric}>
          <div className={styles.metricLabel}>Avg Interest</div>
          <div className={styles.metricValue}>{analysis.averageInterest}/100</div>
        </div>
      </div>

      {/* Simulated Data Badge */}
      <div className={styles.simulatedBadge}>
        ⚠️ Simulated Data - Real Google Trends integration coming soon
      </div>

      {/* Brutalist Line Chart */}
      <div className={styles.chartWrapper}>
        <div className={styles.chartTitle}>12-Month Search Interest</div>
        <div className={styles.chart}>
          {/* Y-axis labels */}
          <div className={styles.yAxis}>
            <span>100</span>
            <span>50</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className={styles.chartArea}>
            {/* Grid lines */}
            <div className={styles.gridLines}>
              <div className={styles.gridLine} />
              <div className={styles.gridLine} />
              <div className={styles.gridLine} />
            </div>

            {/* Line graph using SVG */}
            <svg className={styles.svg} viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              {/* Area fill */}
              <path
                d={generateAreaPath(analysis.timelineData, maxValue, chartWidth, chartHeight)}
                fill="url(#gradient)"
                opacity="0.3"
              />
              
              {/* Line */}
              <path
                d={generateLinePath(analysis.timelineData, maxValue, chartWidth, chartHeight)}
                stroke={getTrendColor(analysis.trend)}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={getTrendColor(analysis.trend)} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={getTrendColor(analysis.trend)} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Data points */}
            {analysis.timelineData.map((point, i) => {
              const x = (i / (analysis.timelineData.length - 1)) * 100;
              const y = chartHeight - (point.value / maxValue) * chartHeight;
              
              return (
                <div
                  key={i}
                  className={styles.dataPoint}
                  style={{
                    left: `${x}%`,
                    bottom: `${(point.value / maxValue) * 100}%`,
                    background: getTrendColor(analysis.trend),
                  }}
                  title={`${point.date}: ${point.value}`}
                />
              );
            })}
          </div>
        </div>

        {/* X-axis (months) */}
        <div className={styles.xAxis}>
          <span>{analysis.timelineData[0]?.date.slice(0, 7)}</span>
          <span>6 months</span>
          <span>{analysis.timelineData[analysis.timelineData.length - 1]?.date.slice(0, 7)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <span className={styles.timestamp}>
          Researched: {new Date(analysis.researchedAt).toLocaleDateString()}
        </span>
        {onFetch && (
          <button onClick={onFetch} className={styles.refreshButton}>
            🔄 Refresh
          </button>
        )}
      </div>
    </div>
  );
}

// Helper functions for SVG path generation
function generateLinePath(data: any[], maxValue: number, width: number, height: number): string {
  if (data.length === 0) return '';

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (point.value / maxValue) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(' L ')}`;
}

function generateAreaPath(data: any[], maxValue: number, width: number, height: number): string {
  if (data.length === 0) return '';

  const linePath = generateLinePath(data, maxValue, width, height);
  return `${linePath} L ${width},${height} L 0,${height} Z`;
}
