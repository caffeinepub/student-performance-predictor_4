# Student Performance Predictor

## Current State
New project. Empty Motoko backend and React frontend scaffold.

## Requested Changes (Diff)

### Add
- Student profile management: store student academic data (study hours/week, attendance %, previous GPA, assignments completed %, sleep hours, extracurricular activities count)
- Performance prediction engine: rule/weight-based algorithm in Motoko that predicts final grade (A/B/C/D/F) and a numeric score (0-100)
- Student records: save each prediction with timestamp for history tracking
- Admin/Teacher role: view all students' records and predictions
- Student role: enter own data, view own predictions and history
- Dashboard: summary stats (average predicted score, grade distribution), recent predictions list
- Analytics: breakdown of input factors and their influence on prediction

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: Authorization with student/admin roles
2. Backend: Data types for StudentRecord (input factors + predicted score + grade + timestamp)
3. Backend: Prediction algorithm (weighted scoring of input factors)
4. Backend: CRUD APIs - submitPrediction, getMyRecords, getAllRecords (admin), getStats
5. Frontend: Login/Register page with role selection
6. Frontend: Student dashboard - input form + prediction result display
7. Frontend: History page - table of past predictions
8. Frontend: Admin dashboard - all students overview, grade distribution chart
