import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  Award,
  BookOpen,
  Clock,
  Loader2,
  Moon,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { RawRecord } from "../backend.d";
import ScoreGauge, { getGradeInfo } from "../components/ScoreGauge";
import {
  useMyRecords,
  useSubmitPrediction,
  useUserProfile,
} from "../hooks/useQueries";

interface FormValues {
  studyHours: number;
  attendance: number;
  previousGPA: number;
  assignmentsCompleted: number;
  sleepHours: number;
  extracurriculars: number;
}

function GradeBadge({ grade }: { grade: string }) {
  const g = grade.toLowerCase();
  const info = getGradeInfo(
    g === "a" ? 95 : g === "b" ? 85 : g === "c" ? 75 : g === "d" ? 65 : 50,
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

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudentDashboard() {
  const { data: profile } = useUserProfile();
  const { data: records, isLoading: recordsLoading } = useMyRecords();
  const { mutateAsync: submitPrediction, isPending } = useSubmitPrediction();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      studyHours: 6,
      attendance: 85,
      previousGPA: 3.0,
      assignmentsCompleted: 80,
      sleepHours: 7,
      extracurriculars: 2,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const studentName = profile?.name || "Student";
    try {
      await submitPrediction({
        studyHours: values.studyHours,
        attendance: values.attendance,
        previousGPA: Math.round(values.previousGPA * 25),
        assignmentsCompleted: values.assignmentsCompleted,
        sleepHours: values.sleepHours,
        extracurriculars: values.extracurriculars,
        studentName,
      });
      toast.success("Prediction submitted!");
      reset();
    } catch {
      toast.error("Failed to submit prediction");
    }
  };

  const latestRecord = records?.[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-ocid="student.page">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {profile?.name ? `Hello, ${profile.name} 👋` : "Student Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Predict your academic performance based on your study habits.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="shadow-card" data-ocid="prediction.card">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Predict Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" /> Study
                    Hours / Day
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    placeholder="0 – 20"
                    data-ocid="prediction.study_hours.input"
                    {...register("studyHours", {
                      required: true,
                      min: 0,
                      max: 20,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.studyHours && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.study_hours.error"
                    >
                      Required (0–20)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" /> Attendance
                    %
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0 – 100"
                    data-ocid="prediction.attendance.input"
                    {...register("attendance", {
                      required: true,
                      min: 0,
                      max: 100,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.attendance && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.attendance.error"
                    >
                      Required (0–100)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-primary" /> Previous GPA
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={4}
                    step={0.1}
                    placeholder="0.0 – 4.0"
                    data-ocid="prediction.gpa.input"
                    {...register("previousGPA", {
                      required: true,
                      min: 0,
                      max: 4,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.previousGPA && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.gpa.error"
                    >
                      Required (0–4.0)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-primary" />{" "}
                    Assignments Done %
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="0 – 100"
                    data-ocid="prediction.assignments.input"
                    {...register("assignmentsCompleted", {
                      required: true,
                      min: 0,
                      max: 100,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.assignmentsCompleted && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.assignments.error"
                    >
                      Required
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-primary" /> Sleep Hours /
                    Night
                  </Label>
                  <Input
                    type="number"
                    min={4}
                    max={12}
                    step={0.5}
                    placeholder="4 – 12"
                    data-ocid="prediction.sleep.input"
                    {...register("sleepHours", {
                      required: true,
                      min: 4,
                      max: 12,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.sleepHours && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.sleep.error"
                    >
                      Required (4–12)
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />{" "}
                    Extracurriculars
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    placeholder="0 – 10"
                    data-ocid="prediction.extracurriculars.input"
                    {...register("extracurriculars", {
                      required: true,
                      min: 0,
                      max: 10,
                      valueAsNumber: true,
                    })}
                  />
                  {errors.extracurriculars && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="prediction.extracurriculars.error"
                    >
                      Required
                    </p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold"
                disabled={isPending}
                data-ocid="prediction.submit_button"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Predicting...
                  </>
                ) : (
                  "Predict Performance"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-card" data-ocid="prediction.result.card">
          <CardHeader>
            <CardTitle className="text-base">
              Latest Prediction Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {recordsLoading ? (
                <div
                  className="flex flex-col items-center gap-4 py-8"
                  data-ocid="prediction.result.loading_state"
                >
                  <Skeleton className="w-44 h-44 rounded-full" />
                  <Skeleton className="w-32 h-5" />
                </div>
              ) : latestRecord ? (
                <motion.div
                  key={latestRecord.timestamp.toString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <ScoreGauge
                    score={Number(latestRecord.predictedScore)}
                    size={180}
                  />
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Predicted on {formatDate(latestRecord.timestamp)}
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="font-semibold text-foreground">
                          {Number(latestRecord.studyHours)}h
                        </p>
                        <p className="text-muted-foreground">Study</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="font-semibold text-foreground">
                          {Number(latestRecord.attendance)}%
                        </p>
                        <p className="text-muted-foreground">Attendance</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 text-center">
                        <p className="font-semibold text-foreground">
                          {(Number(latestRecord.previousGPA) / 25).toFixed(1)}
                        </p>
                        <p className="text-muted-foreground">GPA</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div
                  className="flex flex-col items-center gap-4 py-12 text-center"
                  data-ocid="prediction.result.empty_state"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "oklch(var(--primary) / 0.1)" }}
                  >
                    <TrendingUp
                      className="w-8 h-8"
                      style={{ color: "oklch(var(--primary))" }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      No predictions yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fill the form and submit your first prediction.
                    </p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Prediction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recordsLoading ? (
            <div className="p-6 space-y-3" data-ocid="history.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          ) : records && records.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Study Hrs</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r: RawRecord, i: number) => (
                  <TableRow
                    key={r.timestamp.toString()}
                    data-ocid={`history.item.${i + 1}`}
                  >
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(r.timestamp)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {Number(r.predictedScore)}
                    </TableCell>
                    <TableCell>
                      <GradeBadge grade={r.predictedGrade} />
                    </TableCell>
                    <TableCell>{Number(r.studyHours)}h</TableCell>
                    <TableCell>{Number(r.attendance)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center" data-ocid="history.empty_state">
              <p className="text-muted-foreground text-sm">
                No prediction history yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
