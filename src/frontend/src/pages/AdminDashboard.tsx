import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, BarChart3, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import type { RawRecord } from "../backend.d";
import { getGradeInfo } from "../components/ScoreGauge";
import { useAllRecords, useStats } from "../hooks/useQueries";

function GradeBadge({ grade }: { grade: string }) {
  const info = getGradeInfo(
    grade.toLowerCase() === "a"
      ? 95
      : grade.toLowerCase() === "b"
        ? 85
        : grade.toLowerCase() === "c"
          ? 75
          : grade.toLowerCase() === "d"
            ? 65
            : 50,
  );
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
      style={{ background: `${info.color}20`, color: info.color }}
    >
      {grade.toUpperCase()}
    </span>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const info = getGradeInfo(score);
  return (
    <span className="text-sm font-semibold" style={{ color: info.color }}>
      {score}
    </span>
  );
}

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const gradeLabels: {
  key: "a" | "b" | "c" | "d" | "f";
  label: string;
  score: number;
}[] = [
  { key: "a", label: "A (90–100)", score: 95 },
  { key: "b", label: "B (80–89)", score: 85 },
  { key: "c", label: "C (70–79)", score: 75 },
  { key: "d", label: "D (60–69)", score: 65 },
  { key: "f", label: "F (< 60)", score: 50 },
];

const statCards = [
  {
    icon: Users,
    label: "Total Predictions",
    key: "total" as const,
    color: "oklch(var(--primary))",
    ocid: "admin.total_predictions.card",
  },
  {
    icon: TrendingUp,
    label: "Average Score",
    key: "avg" as const,
    color: "oklch(var(--grade-a))",
    ocid: "admin.avg_score.card",
  },
  {
    icon: Award,
    label: "Grade A Students",
    key: "gradeA" as const,
    color: "oklch(var(--grade-b))",
    ocid: "admin.grade_a.card",
  },
];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: records, isLoading: recordsLoading } = useAllRecords();

  const totalGrades = stats
    ? Number(stats.gradesDistribution.a) +
      Number(stats.gradesDistribution.b) +
      Number(stats.gradesDistribution.c) +
      Number(stats.gradesDistribution.d) +
      Number(stats.gradesDistribution.f)
    : 0;

  const statValues: Record<string, string | null> = {
    total: statsLoading ? null : String(stats?.totalRecords ?? 0),
    avg: statsLoading ? null : `${(stats?.averageScore ?? 0).toFixed(1)}`,
    gradeA: statsLoading ? null : String(stats?.gradesDistribution.a ?? 0),
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-ocid="admin.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Overview of all student predictions and performance metrics.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="shadow-card" data-ocid={stat.ocid}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    {statValues[stat.key] === null ? (
                      <Skeleton className="w-20 h-8 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold text-foreground mt-1">
                        {statValues[stat.key]}
                      </p>
                    )}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${stat.color}15` }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-card" data-ocid="admin.grade_dist.card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {statsLoading ? (
              <div
                className="space-y-3"
                data-ocid="admin.grade_dist.loading_state"
              >
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="w-full h-8" />
                ))}
              </div>
            ) : (
              gradeLabels.map(({ key, label, score }) => {
                const count = Number(stats?.gradesDistribution[key] ?? 0);
                const pct = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
                const info = getGradeInfo(score);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-foreground">
                        {label}
                      </span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <div
                      className="w-full h-2.5 rounded-full"
                      style={{ background: "oklch(var(--border))" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: info.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">All Student Records</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recordsLoading ? (
              <div
                className="p-6 space-y-3"
                data-ocid="admin.records.loading_state"
              >
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full h-10" />
                ))}
              </div>
            ) : records && records.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r: RawRecord, i: number) => (
                      <TableRow
                        key={r.timestamp.toString()}
                        data-ocid={`admin.records.item.${i + 1}`}
                      >
                        <TableCell className="font-medium">
                          {r.studentName || "—"}
                        </TableCell>
                        <TableCell>
                          <ScoreBadge score={Number(r.predictedScore)} />
                        </TableCell>
                        <TableCell>
                          <GradeBadge grade={r.predictedGrade} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(r.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div
                className="py-12 text-center"
                data-ocid="admin.records.empty_state"
              >
                <p className="text-muted-foreground text-sm">
                  No student records yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
