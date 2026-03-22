import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    gradesDistribution: {
        a: bigint;
        b: bigint;
        c: bigint;
        d: bigint;
        f: bigint;
    };
    totalRecords: bigint;
    averageScore: number;
}
export interface UserProfile {
    name: string;
}
export interface RawRecord {
    extracurriculars: bigint;
    studentName: string;
    owner: Principal;
    predictedScore: bigint;
    predictedGrade: string;
    studyHours: bigint;
    assignmentsCompleted: bigint;
    attendance: bigint;
    timestamp: bigint;
    previousGPA: bigint;
    sleepHours: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllRecords(): Promise<Array<RawRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyRecords(): Promise<Array<RawRecord>>;
    getStats(): Promise<Stats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitPrediction(studyHours: number, attendance: number, previousGPA: number, assignmentsCompleted: number, sleepHours: number, extracurriculars: number, studentName: string): Promise<void>;
}
