# Implementation Plan: Feedback Insights Platform - Priority Scoring

## Overview

Add priority scoring and classification to the insight processing pipeline to automatically prioritize feedback based on sentiment and content signals.

## Tasks

### Backend Implementation

- [x] 1. Update database models for priority fields
  - Add priority_score column to Insight model (Integer)
  - Add priority_level column to Insight model (String: HIGH/MEDIUM/LOW)
  - Update FeedbackWithInsights response model to include priority fields
  - Create database migration or update create_tables function
  - _Requirements: 16.17_

- [x] 2. Implement priority scoring logic in insight pipeline
  - Create calculate_priority_score function in feedback_pipeline.py
  - Implement Rule 1: Sentiment-based scoring
    - sentiment <= -0.6 → +40 points
    - sentiment <= -0.3 → +25 points
    - sentiment < 0 → +15 points
    - sentiment >= 0 → +0 points
  - Implement Rule 2: Revenue/Critical Flow Impact (+25 points)
    - Keywords: "payment", "checkout", "purchase", "billing", "invoice", "transaction"
  - Implement Rule 3: Blocker/Failure Signals (+20 points)
    - Keywords: "can't", "cannot", "unable", "fails", "failed", "broken", "error", "not working"
  - Implement Rule 4: Usability/Friction Signals (+10 points)
    - Keywords: "hard", "confusing", "too many", "difficult", "pain", "painful", "slow"
  - Implement Rule 5: First-Time User Risk (+5 points)
    - Keywords: "first time", "new user", "getting started", "onboarding"
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10, 16.11, 16.12, 16.13_

- [x] 3. Implement priority classification logic
  - Create classify_priority_level function
  - score >= 60 → "HIGH"
  - score >= 30 and < 60 → "MEDIUM"
  - score < 30 → "LOW"
  - _Requirements: 16.14, 16.15, 16.16_

- [x] 4. Update analyze_feedback function
  - Call calculate_priority_score with message and sentiment_score
  - Call classify_priority_level with priority_score
  - Include priority_score and priority_level in return dictionary
  - _Requirements: 16.1, 16.17_

- [x] 5. Update API endpoint to return priority fields
  - Ensure GET /api/feedback includes priority_score and priority_level
  - Update response parsing to handle new fields
  - Test API response includes priority data
  - _Requirements: 16.18_

### Frontend Implementation

- [x] 6. Update FeedbackList component to display priority columns
  - Add Priority Score column to feedback table
  - Add Priority Level column to feedback table
  - Style priority level with color coding:
    - HIGH: Red background
    - MEDIUM: Yellow/Orange background
    - LOW: Green background
  - Position priority columns after sentiment score column
  - _Requirements: 16.18, 16.19, 16.20_

- [x] 7. Add priority sorting functionality
  - Enable sorting by priority score
  - Enable sorting by priority level
  - Update table header to indicate sortable columns
  - _Requirements: 16.18_

### Testing

- [ ] 8. Write unit tests for priority scoring logic
  - Test Rule 1: Sentiment-based scoring with various sentiment values
  - Test Rule 2: Revenue keyword detection
  - Test Rule 3: Blocker keyword detection
  - Test Rule 4: Usability keyword detection
  - Test Rule 5: First-time user keyword detection
  - Test combined rules (multiple keywords in one message)
  - Test case-insensitive keyword matching
  - _Requirements: 16.2-16.13_

- [ ] 9. Write unit tests for priority classification
  - Test HIGH classification (score >= 60)
  - Test MEDIUM classification (30 <= score < 60)
  - Test LOW classification (score < 30)
  - Test boundary values (exactly 30, exactly 60)
  - _Requirements: 16.14, 16.15, 16.16_

- [ ] 10. Write integration tests for priority in API
  - Test POST /api/feedback triggers priority calculation
  - Test GET /api/feedback returns priority fields
  - Test priority fields are correctly stored in database
  - Test priority calculation with real feedback examples
  - _Requirements: 16.17, 16.18_

- [ ] 11. Update existing tests for new fields
  - Update test fixtures to include priority fields
  - Update API response assertions to check priority fields
  - Ensure backward compatibility with existing tests
  - _Requirements: 16.17_

### Documentation

- [ ] 12. Update documentation
  - Document priority scoring rules in design.md
  - Update README.md with priority scoring feature
  - Add examples of priority calculations
  - Document priority level color coding
  - _Requirements: 16.1-16.20_

- [ ] 13. Final validation
  - Test priority scoring with various feedback examples
  - Verify priority display in UI
  - Verify priority sorting works correctly
  - Run all tests to ensure no regressions
  - Generate test coverage report

## Priority Scoring Rules Summary

### Rule 1: Sentiment-Based Scoring
```
if sentiment_score <= -0.6: +40 points
if sentiment_score <= -0.3: +25 points
if sentiment_score < 0:     +15 points
if sentiment_score >= 0:    +0 points
```

### Rule 2: Revenue/Critical Flow Impact (+25 points)
Keywords: payment, checkout, purchase, billing, invoice, transaction

### Rule 3: Blocker/Failure Signals (+20 points)
Keywords: can't, cannot, unable, fails, failed, broken, error, not working

### Rule 4: Usability/Friction Signals (+10 points)
Keywords: hard, confusing, too many, difficult, pain, painful, slow

### Rule 5: First-Time User Risk (+5 points)
Keywords: first time, new user, getting started, onboarding

### Priority Classification
```
score >= 60: HIGH
score >= 30: MEDIUM
score < 30:  LOW
```

## Example Calculations

**Example 1: Critical Payment Issue**
- Message: "Payment checkout is broken and not working"
- Sentiment: -0.7 (very negative)
- Rule 1: +40 (sentiment <= -0.6)
- Rule 2: +25 (contains "payment", "checkout")
- Rule 3: +20 (contains "broken", "not working")
- Total: 85 points → **HIGH priority**

**Example 2: Usability Feedback**
- Message: "The interface is confusing and difficult to use"
- Sentiment: -0.2 (slightly negative)
- Rule 1: +15 (sentiment < 0)
- Rule 4: +10 (contains "confusing", "difficult")
- Total: 25 points → **LOW priority**

**Example 3: New User Onboarding Issue**
- Message: "As a first time user, getting started is hard"
- Sentiment: -0.4 (negative)
- Rule 1: +25 (sentiment <= -0.3)
- Rule 4: +10 (contains "hard")
- Rule 5: +5 (contains "first time", "getting started")
- Total: 40 points → **MEDIUM priority**

## Notes

- Priority scoring is cumulative across all rules
- Keyword matching should be case-insensitive
- Multiple occurrences of keywords in same category count only once
- Priority score and level are calculated during insight processing
- Priority fields are stored in database for historical tracking
- UI should clearly indicate priority with color coding
