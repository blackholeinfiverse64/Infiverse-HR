# Bulk Notifications UI/UX Testing Guide

## Overview
This guide provides comprehensive test scenarios for the Bulk Notifications feature in the BatchOperations page. Test both **UI/UX** (visual elements, interactions, feedback) and **functional behavior** (data filtering, validation, API integration).

---

## 🚀 Quick Start

### Prerequisites
1. **Start Backend Services:**
   ```powershell
   cd backend
   .\START_BACKEND.ps1
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   .\START_FRONTEND.ps1
   ```

3. **Login Credentials:**
   - Role: **Recruiter**
   - Email: `recruiter@bhiv.hr` (or your test recruiter account)
   - Password: Your password

4. **Navigate to:** Dashboard → Batch Operations → **Bulk Notifications** tab

---

## 📋 Test Scenarios

### **1. Data Isolation Testing**

#### 1.1 Recruiter-Specific Candidates
**Objective:** Verify only candidates who applied to the recruiter's jobs are shown

**Steps:**
1. Login as **Recruiter A**
2. Navigate to Batch Operations → Bulk Notifications
3. Select each notification type from the dropdown
4. Note down candidate IDs/names shown

**Expected Result:**
- ✅ Only candidates who applied to Recruiter A's jobs appear
- ✅ No candidates from other recruiters' jobs

**How to Verify:**
- Check browser console logs: Look for `🔍 Loading candidates for [type]:` with `recruiter_id` filter
- Check backend logs: Verify query includes recruiter_id filtering
- Login as **Recruiter B** and verify different candidates appear

---

### **2. Notification Type Filtering**

#### 2.1 Shortlisted Candidates
**Objective:** Verify filtering logic for shortlisted notifications

**Steps:**
1. Select **"🎯 Shortlisted (Passed Screening)"** from dropdown
2. Observe loaded candidates

**Expected Result:**
- ✅ Only candidates with `status = 'shortlisted'`
- ✅ Matching score ≥ 70
- ✅ Excludes candidates with status: `rejected`, `withdrawn`, `hired`
- ✅ Status badge shows green "shortlisted"

**Test Data Requirements:**
- Create test candidates with:
  - Status: `shortlisted`, matching_score: 85 → **Should appear**
  - Status: `shortlisted`, matching_score: 65 → **Should NOT appear**
  - Status: `rejected`, matching_score: 90 → **Should NOT appear**

---

#### 2.2 Interview Scheduled
**Objective:** Verify filtering for interview scheduled notifications

**Steps:**
1. Select **"📅 Interview Scheduled"**
2. Check loaded candidates

**Expected Result:**
- ✅ Only candidates with `has_interview = true`
- ✅ Interview date ≥ today (future interviews only)
- ✅ Status: `shortlisted` OR `interview_scheduled`
- ✅ Status badge shows blue "interview_scheduled"

**Test Data Requirements:**
- Candidate with `interview_date = tomorrow`, status = `interview_scheduled` → **Should appear**
- Candidate with `interview_date = yesterday`, status = `interviewed` → **Should NOT appear**
- Candidate with no interview_date → **Should NOT appear**

---

#### 2.3 Feedback Request
**Objective:** Verify filtering for post-interview feedback requests

**Steps:**
1. Select **"💬 Feedback Request (Post-Interview)"**
2. Check loaded candidates

**Expected Result:**
- ✅ Status: `interviewed` OR `awaiting_feedback`
- ✅ Interview date < today (past interviews)
- ✅ `feedback_submitted = false`
- ✅ Status badge shows purple "interviewed" or "awaiting_feedback"

**Test Data Requirements:**
- Candidate with `interview_date = 2 days ago`, status = `interviewed`, feedback_submitted = false → **Should appear**
- Candidate with `interview_date = 2 days ago`, feedback_submitted = true → **Should NOT appear**
- Candidate with `interview_date = tomorrow` → **Should NOT appear**

---

#### 2.4 Application Received
**Objective:** Verify filtering for new applicants

**Steps:**
1. Select **"✉️ Application Received (New Applicants)"**
2. Check loaded candidates

**Expected Result:**
- ✅ Status: `pending`, `new`, OR `application_received`
- ✅ Created within last 7 days
- ✅ Status badge shows yellow/default color

**Test Data Requirements:**
- Candidate created 3 days ago, status = `new` → **Should appear**
- Candidate created 10 days ago, status = `pending` → **Should NOT appear**
- Candidate created 2 days ago, status = `shortlisted` → **Should NOT appear**

---

#### 2.5 Rejection Notification
**Objective:** Verify filtering for rejection notifications

**Steps:**
1. Select **"❌ Rejection Notification"**
2. Check loaded candidates

**Expected Result:**
- ✅ Status: `rejected`
- ✅ Excludes: `withdrawn_by_candidate`
- ✅ Status badge shows red "rejected"

**Test Data Requirements:**
- Candidate with status = `rejected` → **Should appear**
- Candidate with status = `withdrawn_by_candidate` → **Should NOT appear**

---

### **3. UI/UX Elements Testing**

#### 3.1 Loading States
**Objective:** Verify loading indicators and feedback

**Steps:**
1. Select different notification types rapidly
2. Observe loading indicators

**Expected Result:**
- ✅ Spinner icon appears: `🔄 Loading candidates...`
- ✅ Dropdown disabled during loading
- ✅ "Add Candidate" button disabled during loading
- ✅ Previous candidates cleared before new ones load
- ✅ Loading completes within 3 seconds

---

#### 3.2 Empty States
**Objective:** Test behavior when no candidates match filters

**Steps:**
1. Select a notification type with no matching candidates
2. Observe empty state display

**Expected Result:**
- ✅ Centered message: "No candidates found for this notification type"
- ✅ Helpful tips displayed (bulleted list explaining filter criteria)
- ✅ Toast notification: `ℹ️ No candidates found for [type] notifications`
- ✅ Toast auto-dismisses after 3 seconds
- ✅ "Add Candidate" button still enabled (can manually add)

---

#### 3.3 Status Badges
**Objective:** Verify status badge colors and labels

**Steps:**
1. Load candidates with various statuses
2. Check badge styling

**Expected Result:**
- ✅ `shortlisted` → Green badge (`bg-green-100 text-green-800`)
- ✅ `interview_scheduled` → Blue badge
- ✅ `interviewed` → Purple badge
- ✅ `rejected` → Red badge
- ✅ Other statuses → Yellow badge (default)
- ✅ Badge text matches candidate status exactly

---

#### 3.4 Toast Notifications
**Objective:** Test all toast message scenarios

**Test Cases:**

| Scenario | Expected Toast | Duration | Icon |
|----------|---------------|----------|------|
| Candidates loaded (5 found) | "Found 5 candidate(s) for notifications" | 3s | ✅ |
| No candidates found | "No candidates found for shortlisted notifications" | 3s | ℹ️ |
| Network error | "Network error: Cannot connect to server..." | 5s | ❌ |
| Validation errors present | "Please fix validation errors before sending..." | 5s | ❌ |
| Invalid contacts (2 candidates) | "2 candidate(s) have invalid contact info..." | 6s | ❌ |
| Bulk send success (8/10) | "✅ Bulk notifications sent to 8/10 candidates (2 failed)" | 5s | ✅ |
| All send failed | "❌ Failed to send notifications to all 5 candidates..." | 5s | ❌ |

---

### **4. Validation Testing**

#### 4.1 Email Validation - Real-Time
**Objective:** Test email validation as user types

**Steps:**
1. Add a new candidate
2. Type various email values in the email field
3. Observe validation feedback

**Test Cases:**

| Input | Expected Result | Error Message |
|-------|----------------|---------------|
| (empty) | ❌ Red border | "Email is required" |
| `invalid` | ❌ Red border | "Invalid email format (e.g., user@example.com)" |
| `test@example.com` | ❌ Red border | "Please use a real email address" |
| `test@company.com` | ❌ Red border | "Please use a real email address" (blocked prefix) |
| `demo@example.com` | ❌ Red border | "Please use a real email address" |
| `john@company.com` | ✅ Normal border | No error |
| `user+tag@example.co.uk` | ✅ Normal border | No error |

**Expected Behavior:**
- ✅ Error appears **immediately** as user types/leaves field
- ✅ Error disappears when valid email entered
- ✅ Red border and inline text below input field
- ✅ Error persists until fixed

---

#### 4.2 Phone Validation - Real-Time
**Objective:** Test phone validation

**Steps:**
1. Add a new candidate
2. Enter phone in the phone field (leave email blank for now)
3. Test various formats

**Test Cases:**

| Input | Expected Result | Error Message |
|-------|----------------|---------------|
| (empty) | ✅ No error | None (phone is optional if email provided) |
| `123` | ❌ Red border | "Invalid phone format (min 10 digits)" |
| `+1234567890` | ❌ Red border | "Please use a real phone number" (blocked) |
| `1234567890` | ❌ Red border | "Please use a real phone number" (blocked) |
| `+919876543210` | ✅ Normal border | No error |
| `(555) 123-4567` | ✅ Normal border | No error |
| `+1 555-123-4567` | ✅ Normal border | No error |

**Expected Behavior:**
- ✅ Phone is **optional** (no error if empty and email is valid)
- ✅ If provided, must be valid (10+ digits)
- ✅ Accepts international formats with `+`, spaces, `-`, `()`, `.`

---

#### 4.3 Contact Required Validation
**Objective:** Test at least one contact method required

**Steps:**
1. Add candidate with **no email and no phone**
2. Try to send notifications

**Expected Result:**
- ❌ Both fields show error: "Email or phone is required"
- ❌ Validation banner appears: "⚠️ Validation Errors Found (1 candidate)"
- ❌ Send button shows toast: "Please fix validation errors before sending notifications"

---

#### 4.4 Batch Validation Banner
**Objective:** Test validation error summary banner

**Steps:**
1. Add 3 candidates:
   - Candidate 1: Invalid email
   - Candidate 2: Valid
   - Candidate 3: Invalid phone
2. Observe banner

**Expected Result:**
- ✅ Red banner appears above candidate list
- ✅ Text: "⚠️ Validation Errors Found (2 candidates)"
- ✅ Subtext: "Please fix the errors highlighted below before sending notifications."
- ✅ Banner disappears when all errors fixed
- ✅ Each invalid candidate has red background (`bg-red-50 dark:bg-red-900/10`)

---

### **5. Manual Candidate Management**

#### 5.1 Add Candidate
**Objective:** Test manually adding candidates

**Steps:**
1. Click **"+ Add Candidate"** button
2. Fill in details

**Expected Result:**
- ✅ New empty row appears with 3 input fields + Remove button
- ✅ Placeholder text: "Name", "Email *", "Phone"
- ✅ All fields empty and editable
- ✅ Can add multiple candidates
- ✅ No validation errors initially

---

#### 5.2 Remove Candidate
**Objective:** Test removing candidates

**Steps:**
1. Load candidates or add manually
2. Click **"Remove"** button on candidate

**Expected Result:**
- ✅ Candidate removed immediately
- ✅ No confirmation dialog
- ✅ Candidate count updates in header
- ✅ Validation errors for that candidate cleared

---

#### 5.3 Edit Candidate
**Objective:** Test editing loaded candidates

**Steps:**
1. Load candidates via notification type
2. Edit email/phone fields
3. Verify validation triggers

**Expected Result:**
- ✅ Can edit all fields (name, email, phone)
- ✅ Real-time validation applies
- ✅ Status badge remains visible (read-only field)
- ✅ Changes persist until page refresh or reload

---

### **6. Bulk Send Functionality**

#### 6.1 Successful Bulk Send
**Objective:** Test successful notification sending

**Prerequisites:**
- Backend services running
- Valid candidates with real email addresses
- (Optional) Configure email service or use mock mode

**Steps:**
1. Load 5 candidates with valid emails
2. Select a job (optional)
3. Click **"📧 Send Bulk Notifications"**
4. Observe response

**Expected Result:**
- ✅ Button shows: "📧 Sending..." during request
- ✅ Button disabled during send
- ✅ Success toast: "✅ Bulk notifications sent to 5/5 candidates (0 failed)"
- ✅ Toast duration: 5 seconds
- ✅ Button re-enabled after completion
- ✅ Console shows: `✅ Notification response:` with result details

---

#### 6.2 Large Batch Warning
**Objective:** Test confirmation dialog for large batches

**Steps:**
1. Load or add **21+ candidates**
2. Click **"Send Bulk Notifications"**

**Expected Result:**
- ✅ Browser confirm dialog appears
- ✅ Message: "You are about to send notifications to 21 candidates. This action cannot be undone. Continue?"
- ✅ If **Cancel** clicked → No notifications sent
- ✅ If **OK** clicked → Notifications sent
- ✅ Threshold: 20 candidates (configurable in `notifications.config.ts`)

---

#### 6.3 Partial Failure Handling
**Objective:** Test handling when some notifications fail

**Prerequisites:**
- Mix of valid and invalid email addresses (e.g., backend rejects some)

**Steps:**
1. Load 10 candidates
2. Some have deliverable emails, others don't
3. Send bulk notifications

**Expected Result:**
- ✅ Toast shows: "✅ Bulk notifications sent to 7/10 candidates (3 failed)"
- ✅ Success count reflects actual deliveries
- ✅ Failed count reflects errors
- ✅ Backend logs show detailed error reasons

---

#### 6.4 Network Error Handling
**Objective:** Test behavior when backend is unreachable

**Steps:**
1. Stop backend services
2. Try to send bulk notifications

**Expected Result:**
- ✅ Toast: "Failed to send bulk notifications: Service may be offline"
- ✅ Button re-enabled
- ✅ Console shows: `❌ Notification error:` with error details
- ✅ No infinite loading state

---

### **7. Job Selection Testing**

#### 7.1 Job Selection Optional
**Objective:** Verify sending notifications without selecting a job

**Steps:**
1. Leave job dropdown at **"Select Job Title"** (empty)
2. Load candidates
3. Send notifications

**Expected Result:**
- ✅ Notifications send successfully
- ✅ Notification uses generic text: "Position" instead of job title
- ✅ No error or warning shown
- ✅ Help text: "Notifications will be sent without specific job information"

---

#### 7.2 Job Selection With Job
**Objective:** Test selecting a specific job

**Steps:**
1. Select a job from dropdown (e.g., "Senior Python Developer – Job ID 123")
2. Send notifications

**Expected Result:**
- ✅ Notification includes job title and job_id
- ✅ Help text: "Notifications will reference the selected job"
- ✅ Backend receives: `job_title: "Senior Python Developer"`, `job_id: "123"`

---

#### 7.3 No Jobs Available
**Objective:** Test when recruiter has no jobs

**Prerequisites:**
- Login with recruiter who has no jobs posted

**Steps:**
1. Navigate to Bulk Notifications
2. Observe job dropdown

**Expected Result:**
- ✅ Gray info box appears instead of dropdown
- ✅ Message: "No jobs available. You can still send notifications without job data."
- ✅ Can still load candidates and send notifications
- ✅ No job_id sent to backend

---

### **8. Responsive Design Testing**

#### 8.1 Desktop View (1920x1080)
**Expected Result:**
- ✅ Candidate cards display in 4-column grid (Name | Email | Phone | Remove)
- ✅ All elements readable and properly spaced
- ✅ No horizontal scrolling

#### 8.2 Tablet View (768x1024)
**Expected Result:**
- ✅ Candidate cards remain in 4-column grid
- ✅ Text may wrap but remains readable
- ✅ Buttons remain accessible

#### 8.3 Mobile View (375x667)
**Expected Result:**
- ✅ Candidate cards stack vertically (1 column)
- ✅ Remove button moves below inputs
- ✅ All interactive elements remain usable
- ✅ Toast notifications don't overflow screen

---

### **9. Dark Mode Testing**

**Steps:**
1. Toggle dark mode in browser/OS settings
2. Test all notification type selections
3. Test validation states

**Expected Result:**
- ✅ All text remains readable (sufficient contrast)
- ✅ Status badges change to dark variants
- ✅ Validation error borders visible (red on dark background)
- ✅ Toast notifications styled for dark mode
- ✅ Loading spinner visible
- ✅ Empty state text readable

---

### **10. Browser Compatibility**

Test in multiple browsers:

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ✅ |
| Firefox | Latest | ✅ |
| Safari | Latest | ✅ |
| Edge | Latest | ✅ |

**Test:**
- Dropdown selection
- Validation styling
- Toast notifications
- Network requests (check DevTools)

---

### **11. Performance Testing**

#### 11.1 Large Candidate Lists
**Steps:**
1. Load notification type with 100 candidates
2. Observe load time and UI responsiveness

**Expected Result:**
- ✅ Loads within 3 seconds
- ✅ No UI freezing
- ✅ Scrolling smooth
- ✅ Validation performs well (no lag when typing)

#### 11.2 Rapid Type Switching
**Steps:**
1. Rapidly switch between notification types 5 times
2. Observe behavior

**Expected Result:**
- ✅ Aborts previous requests (check console: "Request was cancelled")
- ✅ No duplicate candidates
- ✅ Final selection shows correct candidates
- ✅ No memory leaks

---

### **12. Data Persistence Testing**

#### 12.1 Page Refresh
**Steps:**
1. Load candidates for a notification type
2. Manually add 2 candidates
3. Refresh the page

**Expected Result:**
- ❌ Manual candidates lost (expected behavior - no persistence)
- ❌ Notification type resets to default
- ✅ Page loads without errors

#### 12.2 Navigation Away and Back
**Steps:**
1. Configure notification type and candidates
2. Navigate to different page
3. Return to Batch Operations

**Expected Result:**
- ❌ Configuration lost (expected - no state persistence)
- ✅ Can reconfigure from scratch

---

### **13. Accessibility Testing**

#### 13.1 Keyboard Navigation
**Steps:**
1. Use **Tab** key to navigate through page
2. Use **Enter/Space** to interact with buttons/dropdowns

**Expected Result:**
- ✅ Can navigate to all interactive elements
- ✅ Focus visible on current element
- ✅ Dropdowns open with keyboard
- ✅ Can submit form with keyboard only

#### 13.2 Screen Reader Support
**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through form

**Expected Result:**
- ✅ Notification type dropdown announced
- ✅ Validation errors read aloud
- ✅ Button states announced (enabled/disabled/loading)
- ✅ Toast messages announced

---

## 🧪 Test Data Setup

### Create Test Candidates

Use the backend seed script or manually create candidates with these profiles:

#### Candidate 1: Shortlisted Candidate
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+919876543210",
  "status": "shortlisted",
  "matching_score": 85,
  "created_at": "3 days ago"
}
```

#### Candidate 2: Interview Scheduled
```json
{
  "name": "Bob Smith",
  "email": "bob.smith@example.com",
  "phone": "+919876543211",
  "status": "interview_scheduled",
  "matching_score": 78,
  "interview_date": "tomorrow",
  "created_at": "5 days ago"
}
```

#### Candidate 3: Interviewed (Needs Feedback)
```json
{
  "name": "Carol White",
  "email": "carol.white@example.com",
  "phone": "+919876543212",
  "status": "interviewed",
  "matching_score": 90,
  "interview_date": "2 days ago",
  "feedback_submitted": false,
  "created_at": "10 days ago"
}
```

#### Candidate 4: New Applicant
```json
{
  "name": "David Brown",
  "email": "david.brown@example.com",
  "phone": "+919876543213",
  "status": "new",
  "matching_score": 65,
  "created_at": "1 day ago"
}
```

#### Candidate 5: Rejected
```json
{
  "name": "Eve Taylor",
  "email": "eve.taylor@example.com",
  "phone": "+919876543214",
  "status": "rejected",
  "matching_score": 45,
  "created_at": "15 days ago"
}
```

---

## 🐛 Common Issues & Troubleshooting

### Issue: "No candidates found" for all notification types

**Possible Causes:**
- Backend not running
- No candidates in database
- Recruiter has no jobs assigned
- Filter criteria too strict

**Solutions:**
1. Check backend logs for errors
2. Seed database with test data: `python backend/seed_mongodb.py`
3. Verify recruiter has jobs with `recruiter_id` set
4. Check browser console for API errors

---

### Issue: Validation errors persist after fixing

**Possible Causes:**
- Real-time validation not triggering
- Focus not leaving field

**Solutions:**
1. Click outside the field to trigger blur event
2. Try clearing and re-entering value
3. Check browser console for JavaScript errors

---

### Issue: Bulk send shows success but emails not received

**Possible Causes:**
- Backend in mock mode
- Email service not configured
- Spam folder
- Invalid email addresses

**Solutions:**
1. Check backend logs: Look for "mock_sent" status
2. Verify email service credentials in backend `.env`
3. Check recipient spam/junk folders
4. Test with your own email address

---

### Issue: Status badges not showing colors

**Possible Causes:**
- Tailwind CSS not loaded
- Config import error

**Solutions:**
1. Check browser DevTools → Elements → Computed styles
2. Verify `notifications.config.ts` exports correctly
3. Rebuild frontend: `npm run build`

---

## ✅ Test Completion Checklist

Use this checklist to track your testing progress:

- [ ] **1. Data Isolation** - Recruiter sees only their candidates
- [ ] **2.1 Shortlisted** - Filters correctly (status + score)
- [ ] **2.2 Interview Scheduled** - Future interviews only
- [ ] **2.3 Feedback Request** - Past interviews without feedback
- [ ] **2.4 Application Received** - Last 7 days, new statuses
- [ ] **2.5 Rejection** - Rejected candidates only
- [ ] **3.1 Loading States** - Spinner + disabled elements
- [ ] **3.2 Empty States** - Helpful message + tips
- [ ] **3.3 Status Badges** - Correct colors for each status
- [ ] **3.4 Toast Notifications** - All scenarios tested
- [ ] **4.1 Email Validation** - Real-time, blocks test emails
- [ ] **4.2 Phone Validation** - Real-time, blocks test phones
- [ ] **4.3 Contact Required** - At least one required
- [ ] **4.4 Validation Banner** - Shows error count
- [ ] **5.1 Add Candidate** - Manual addition works
- [ ] **5.2 Remove Candidate** - Remove works
- [ ] **5.3 Edit Candidate** - Editing triggers validation
- [ ] **6.1 Successful Send** - Notifications sent
- [ ] **6.2 Large Batch** - Confirmation dialog at 21+
- [ ] **6.3 Partial Failure** - Shows correct counts
- [ ] **6.4 Network Error** - Graceful error handling
- [ ] **7.1 Job Optional** - Works without job selection
- [ ] **7.2 Job Selection** - Job data sent correctly
- [ ] **7.3 No Jobs** - Info message shown
- [ ] **8. Responsive** - Works on all screen sizes
- [ ] **9. Dark Mode** - All elements visible/readable
- [ ] **10. Browser Compatibility** - Tested in 3+ browsers
- [ ] **11. Performance** - 100 candidates load quickly
- [ ] **12. Data Persistence** - Refresh behavior expected
- [ ] **13. Accessibility** - Keyboard navigation + screen reader

---

## 📊 Test Report Template

After completing tests, document your findings:

```markdown
# Bulk Notifications Test Report

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Build Version:** [Frontend version]
**Environment:** Development / Production

## Summary
- Total Tests: 50
- Passed: X
- Failed: X
- Blocked: X

## Critical Issues
1. [Issue description]
   - Severity: High/Medium/Low
   - Steps to Reproduce:
   - Expected vs Actual:
   - Screenshot/Video:

## Minor Issues
[List non-critical issues]

## Performance Observations
- Average candidate load time: Xs
- Validation responsiveness: Good/Fair/Poor
- UI smoothness: Good/Fair/Poor

## Browser-Specific Issues
[Any browser-specific bugs]

## Recommendations
[Suggestions for improvements]
```

---

## 🎯 Success Criteria

The Bulk Notifications feature passes testing if:

✅ **Functional:**
- All 5 notification types filter candidates correctly
- Data isolation works (recruiter sees only their candidates)
- Validation prevents invalid submissions
- Bulk send succeeds with correct counts
- Error handling graceful and informative

✅ **UI/UX:**
- Loading states clear and responsive
- Empty states helpful
- Validation feedback immediate and clear
- Toast messages appropriate and timed correctly
- Status badges color-coded correctly

✅ **Quality:**
- No console errors (warnings acceptable)
- No TypeScript errors
- Responsive on all screen sizes
- Works in all major browsers
- Accessible via keyboard and screen reader

---

## 📞 Support

If you encounter issues during testing:

1. **Check logs:**
   - Browser console (F12)
   - Backend logs (`backend/logs/`)

2. **Documentation:**
   - `frontend/src/config/notifications.config.ts` - Configuration reference
   - `TESTING_GUIDE.md` - General testing guide
   - `ENDPOINT_QUICK_REFERENCE.md` - API reference

3. **Common Fixes:**
   - Rebuild frontend: `npm run build`
   - Restart backend: `.\START_BACKEND.ps1`
   - Clear browser cache: Ctrl+Shift+R
   - Re-seed database: `python backend/seed_mongodb.py`

---

**Happy Testing! 🚀**
