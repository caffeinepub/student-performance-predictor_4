import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RawRecord, Stats, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useMyRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<RawRecord[]>({
    queryKey: ["myRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<RawRecord[]>({
    queryKey: ["allRecords"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery<Stats>({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor) throw new Error("No actor");
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useSubmitPrediction() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      studyHours: number;
      attendance: number;
      previousGPA: number;
      assignmentsCompleted: number;
      sleepHours: number;
      extracurriculars: number;
      studentName: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.submitPrediction(
        params.studyHours,
        params.attendance,
        params.previousGPA,
        params.assignmentsCompleted,
        params.sleepHours,
        params.extracurriculars,
        params.studentName,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myRecords"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    },
  });
}
