import { StatCard } from "@/components/common/StatCard";
import { CheckCircle, AlertTriangle, TrendingUp, Bug, Zap } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface ProjectKPIMetricsProps {
  data: {
    totalTasks: number;
    completedTasks: number;
    activeSprints: number;
    totalBugs: number;
    resolvedBugs: number;
    completionRate: number;
    bugResolutionRate: number;
  };
}

export function ProjectKPIMetrics({ data }: ProjectKPIMetricsProps) {
  const { t } = useTranslation('projects');
  const kpiCards = [
    {
      title: t('analytics.kpi.totalTasks'),
      label: t('analytics.kpi.totalTasks'),
      value: data?.totalTasks,
      description: t('analytics.kpi.allTasksInProject'),
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t('analytics.kpi.completedTasks'),
      label: t('analytics.kpi.completedTasks'),
      value: data?.completedTasks,
      description: t('analytics.kpi.successfullyFinished'),
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      title: t('analytics.kpi.activeSprints'),
      label: t('analytics.kpi.activeSprints'),
      value: data?.activeSprints,
      description: t('analytics.kpi.currentlyRunning'),
      icon: <Zap className="h-4 w-4" />,
      color: "text-purple-600",
    },
    {
      title: t('analytics.kpi.bugResolution'),
      label: t('analytics.kpi.bugResolution'),
      value: `${data?.bugResolutionRate.toFixed(1)}%`,
      description: `${data?.resolvedBugs}/${data?.totalBugs} ${t('analytics.kpi.bugsFixed')}`,
      icon: <Bug className="h-4 w-4" />,
    },
    {
      title: t('analytics.kpi.taskCompletion'),
      label: t('analytics.kpi.taskCompletion'),
      value: `${data?.completionRate.toFixed(1)}%`,
      description: t('analytics.kpi.overallProgress'),
      icon:
        data?.completionRate > 75 ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <AlertTriangle className="h-4 w-4" />
        ),
    },
    {
      title: t('analytics.kpi.openBugs'),
      label: t('analytics.kpi.openBugs'),
      value: data?.totalBugs - data?.resolvedBugs,
      description: t('analytics.kpi.requiresAttention'),
      icon:
        data?.totalBugs - data?.resolvedBugs === 0 ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <Bug className="h-4 w-4" />
        ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}
