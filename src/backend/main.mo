import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);

  // User Profile Management
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Student Performance Prediction System

  func computePredictedScore(studyHours : Float, attendance : Float, previousGPA : Float, assignmentsCompleted : Float, sleepHours : Float, extracurriculars : Float) : Float {
    studyHours * 0.25 + attendance * 0.2 + previousGPA * 0.2 + assignmentsCompleted * 0.2 + sleepHours * 0.1 + extracurriculars * 0.05;
  };

  func computePredictedGrade(score : Float) : Text {
    if (score >= 9.0) {
      "A";
    } else if (score >= 8.0) {
      "B";
    } else if (score >= 7.0) {
      "C";
    } else if (score >= 6.0) {
      "D";
    } else {
      "F";
    };
  };

  func getCurrentTimestamp() : Int {
    Time.now();
  };

  type RawRecord = {
    studyHours : Nat;
    attendance : Nat;
    previousGPA : Nat;
    assignmentsCompleted : Nat;
    sleepHours : Nat;
    extracurriculars : Nat;
    predictedScore : Nat;
    predictedGrade : Text;
    studentName : Text;
    timestamp : Int;
    owner : Principal;
  };

  type StudentRecord = {
    studyHours : Float;
    attendance : Float;
    previousGPA : Float;
    assignmentsCompleted : Float;
    sleepHours : Float;
    extracurriculars : Float;
    predictedScore : Float;
    predictedGrade : Text;
    studentName : Text;
    timestamp : Int;
    owner : Principal;
  };

  type Stats = {
    totalRecords : Nat;
    averageScore : Float;
    gradesDistribution : {
      a : Nat;
      b : Nat;
      c : Nat;
      d : Nat;
      f : Nat;
    };
  };

  module StudentRecord {
    public func compare(a : StudentRecord, b : StudentRecord) : Order.Order {
      Text.compare(a.studentName, b.studentName);
    };
  };

  let studentRecords = Map.empty<Principal, StudentRecord>();

  public shared ({ caller }) func submitPrediction(
    studyHours : Float,
    attendance : Float,
    previousGPA : Float,
    assignmentsCompleted : Float,
    sleepHours : Float,
    extracurriculars : Float,
    studentName : Text
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit predictions");
    };

    if (studyHours > 10.0 or attendance > 10.0 or previousGPA > 10.0 or assignmentsCompleted > 10.0 or sleepHours > 10.0 or extracurriculars > 10.0) {
      Runtime.trap("Input values must be between 0.0 and 10.0");
    };

    let predictedScore = computePredictedScore(studyHours, attendance, previousGPA, assignmentsCompleted, sleepHours, extracurriculars);
    let predictedGrade = computePredictedGrade(predictedScore);
    let record : StudentRecord = {
      studyHours;
      attendance;
      previousGPA;
      assignmentsCompleted;
      sleepHours;
      extracurriculars;
      predictedScore;
      predictedGrade;
      studentName;
      timestamp = getCurrentTimestamp();
      owner = caller;
    };

    studentRecords.add(caller, record);
  };

  public query ({ caller }) func getMyRecords() : async [RawRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their records");
    };

    let iter = studentRecords.entries().toArray().values();
    iter.filter(func(entry) { entry.1.owner == caller }).map(func(entry) { toRawRecord(entry.1) }).toArray();
  };

  func toRawRecord(record : StudentRecord) : RawRecord {
    {
      studyHours = convertToUnsignedNat(record.studyHours);
      attendance = convertToUnsignedNat(record.attendance);
      previousGPA = convertToUnsignedNat(record.previousGPA);
      assignmentsCompleted = convertToUnsignedNat(record.assignmentsCompleted);
      sleepHours = convertToUnsignedNat(record.sleepHours);
      extracurriculars = convertToUnsignedNat(record.extracurriculars);
      predictedScore = convertToUnsignedNat(record.predictedScore);
      predictedGrade = record.predictedGrade;
      studentName = record.studentName;
      timestamp = record.timestamp;
      owner = record.owner;
    };
  };

  func convertToUnsignedNat(value : Float) : Nat {
    let intValue = value.toInt();
    if (intValue >= 0) { intValue.toNat() } else { 0 };
  };

  func convertToFloat(value : Nat) : Float {
    let intValue = value.toInt();
    intValue.toFloat();
  };

  public query ({ caller }) func getAllRecords() : async [RawRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all records");
    };
    studentRecords.entries().toArray().map(func((_, v)) { toRawRecord(v) });
  };

  public query ({ caller }) func getStats() : async Stats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statistics");
    };

    let totalRecords = studentRecords.size();
    let allRecords = studentRecords.values().toArray();

    let averageScore = if (totalRecords > 0) {
      allRecords.foldLeft(
        0.0,
        func(acc, record) { acc + record.predictedScore },
      ) / convertToFloat(totalRecords);
    } else { 0.0 };

    let gradesDistribution = allRecords.foldLeft(
      { a = 0; b = 0; c = 0; d = 0; f = 0 },
      func(acc, record) {
        if (record.predictedGrade == "A") { { a = acc.a + 1; b = acc.b; c = acc.c; d = acc.d; f = acc.f } } else if (record.predictedGrade == "B") {
          { a = acc.a; b = acc.b + 1; c = acc.c; d = acc.d; f = acc.f };
        } else if (record.predictedGrade == "C") {
          { a = acc.a; b = acc.b; c = acc.c + 1; d = acc.d; f = acc.f };
        } else if (record.predictedGrade == "D") {
          { a = acc.a; b = acc.b; c = acc.c; d = acc.d + 1; f = acc.f };
        } else if (record.predictedGrade == "F") {
          { a = acc.a; b = acc.b; c = acc.c; d = acc.d; f = acc.f + 1 };
        } else { acc };
      },
    );

    {
      totalRecords;
      averageScore;
      gradesDistribution;
    };
  };
};
