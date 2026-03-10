# 📧 BHIV HR Notification Templates

Complete library of all email and WhatsApp notification templates used in the BHIV HR automation system.

---

## 1. 🎉 WELCOME NOTIFICATION

**Trigger:** New candidate registration  
**Sequence Type:** `welcome`

### Email Template

**Subject:** 🎉 Welcome to BHIV HR Platform!

**Plain Text Body:**
```
Dear {candidate_name},

Welcome to BHIV HR Platform! 🎉

Your account has been successfully created. We're excited to have you join our community of talented professionals.

✨ What's Next?
• Complete your profile to stand out
• Browse and apply for job opportunities
• Get matched with positions that fit your skills
• Track your application status in real-time

🚀 Get Started:
• Log in to your dashboard
• Upload your resume and portfolio
• Set your job preferences
• Enable notifications for new opportunities

We're here to help you find the perfect role. If you have any questions, feel free to reach out to our support team.

Best regards,
BHIV HR Team
```

**HTML Body:**
```html
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;'>
    <h2 style='color: white; text-align: center;'>🎉 Welcome to BHIV HR Platform!</h2>
  </div>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 10px 10px;'>
    <p>Dear <strong>{candidate_name}</strong>,</p>
    <p>Your account has been successfully created! We're excited to have you join our community of talented professionals.</p>
    <div style='background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <h3 style='color: #2c5aa0;'>✨ What's Next?</h3>
      <ul style='line-height: 1.8;'>
        <li><strong>Complete your profile</strong> to stand out to recruiters</li>
        <li><strong>Browse job opportunities</strong> tailored to your skills</li>
        <li><strong>Get AI-powered matches</strong> for the best-fit positions</li>
        <li><strong>Track your applications</strong> in real-time</li>
      </ul>
    </div>
    <div style='background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <h3 style='color: #28a745;'>🚀 Quick Start Guide:</h3>
      <ol style='line-height: 1.8;'>
        <li>Log in to your dashboard</li>
        <li>Upload your resume and portfolio</li>
        <li>Set your job preferences</li>
        <li>Enable notifications for new opportunities</li>
      </ol>
    </div>
    <p style='margin-top: 20px;'>We're here to help you find the perfect role! If you have any questions, our support team is always ready to assist.</p>
    <p style='margin-top: 20px;'>Best regards,<br><strong>BHIV HR Team</strong></p>
  </div>
</body>
</html>
```

### WhatsApp Template

```
🎉 *Welcome to BHIV HR!*

Hi {candidate_name}! Your account is ready.

✨ *What's Next?*
• Complete your profile
• Browse job opportunities
• Get AI-powered matches
• Track applications

🚀 *Get Started:*
• Log in to your dashboard
• Upload resume
• Set job preferences
• Enable notifications

Welcome aboard! 🚀

_BHIV HR Team_
```

**Interactive Buttons:** None

---

## 2. ✅ APPLICATION RECEIVED

**Trigger:** Candidate submits job application  
**Sequence Type:** `application_received`

### Email Template

**Subject:** ✅ Application Received - {job_title} | BHIV HR

**Plain Text Body:**
```
Dear {candidate_name},

Thank you for applying to {job_title} at BHIV.

Your application is under review. We'll contact you within 3-5 business days.

Application ID: {application_id}

Next Steps:
• AI screening in progress
• HR review within 24-48 hours
• Interview scheduling if shortlisted

Best regards,
BHIV HR Team
```

**HTML Body:**
```html
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
    <h2 style='color: #2c5aa0;'>✅ Application Received</h2>
    <p>Dear <strong>{candidate_name}</strong>,</p>
    <p>Thank you for applying to <strong>{job_title}</strong> at BHIV.</p>
    <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <h3>Application Details:</h3>
      <p><strong>Position:</strong> {job_title}<br>
      <strong>Application ID:</strong> {application_id}<br>
      <strong>Status:</strong> Under Review</p>
    </div>
    <h3>Next Steps:</h3>
    <ul>
      <li>🤖 AI screening in progress</li>
      <li>👥 HR review within 24-48 hours</li>
      <li>📅 Interview scheduling if shortlisted</li>
    </ul>
    <p>Best regards,<br><strong>BHIV HR Team</strong></p>
  </div>
</body>
</html>
```

### WhatsApp Template

```
🎯 *Application Received*

*Position:* {job_title}
*Application ID:* {application_id}
*Status:* Under Review

📋 *Next Steps:*
• AI screening in progress
• HR review within 24-48 hours

We'll update you within 3-5 days!

_BHIV HR Team_
```

**Interactive Buttons:** None

---

## 3. 🎯 SHORTLISTED

**Trigger:** Candidate passes AI screening and HR review  
**Sequence Type:** `shortlisted`

### Email Template

**Subject:** 🎉 Congratulations! Shortlisted - {job_title} | BHIV HR

**Plain Text Body:**
```
Dear {candidate_name},

🎉 Congratulations! You've been shortlisted for {job_title}!

Our AI matching system scored your profile highly based on:
• Technical skills alignment
• Experience relevance
• Cultural fit assessment

Matching Score: {matching_score}/100

Next Steps:
• Our HR team will contact you within 24 hours
• Interview scheduling will follow
• Please keep your calendar flexible

We're excited about the possibility of you joining our team!

Best regards,
BHIV HR Team
```

**HTML Body:**
```html
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
    <h2 style='color: #ffc107;'>🎉 Congratulations! You're Shortlisted!</h2>
    <p>Dear <strong>{candidate_name}</strong>,</p>
    <p>We're excited to inform you that you've been <strong>shortlisted</strong> for the <strong>{job_title}</strong> position!</p>
    <div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <h3>🎯 AI Assessment Results:</h3>
      <p><strong>Matching Score:</strong> {matching_score}/100<br>
      <strong>Technical Skills:</strong> Excellent alignment<br>
      <strong>Experience:</strong> Highly relevant<br>
      <strong>Cultural Fit:</strong> Strong match</p>
    </div>
    <h3>🚀 Next Steps:</h3>
    <ul>
      <li>📞 HR team will contact you within 24 hours</li>
      <li>📅 Interview scheduling will follow</li>
      <li>🗓️ Please keep your calendar flexible</li>
    </ul>
    <p><strong>We're excited about the possibility of you joining our team!</strong></p>
    <p>Best regards,<br><strong>BHIV HR Team</strong></p>
  </div>
</body>
</html>
```

### WhatsApp Template

```
🎉 *SHORTLISTED!*

*Job:* {job_title}
*AI Score:* {matching_score}/100

🎯 *Why you were selected:*
• Technical skills alignment
• Experience relevance
• Cultural fit assessment

📞 We'll call you within 24 hours!

_Congratulations! 🎊_
```

**Interactive Buttons:**
- 🎉 Excited!
- 📅 Schedule Interview
- ❓ Questions

---

## 4. 📅 INTERVIEW SCHEDULED

**Trigger:** HR schedules interview with candidate  
**Sequence Type:** `interview_scheduled`

### Email Template

**Subject:** 📅 Interview Scheduled - {job_title} | BHIV HR

**Plain Text Body:**
```
Dear {candidate_name},

Your interview is scheduled!

📅 Date: {interview_date}
🕐 Time: {interview_time}
👤 Interviewer: {interviewer}
🎥 Format: Video Call
⏱️ Duration: 45 minutes

Interview Preparation:
• Review the job description
• Prepare examples of your work
• Test your video call setup

Please confirm your availability by replying to this email.

Best regards,
BHIV HR Team
```

**HTML Body:**
```html
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
    <h2 style='color: #28a745;'>📅 Interview Scheduled</h2>
    <p>Dear <strong>{candidate_name}</strong>,</p>
    <p>Your interview for <strong>{job_title}</strong> is confirmed!</p>
    <div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <h3>Interview Details:</h3>
      <p><strong>📅 Date:</strong> {interview_date}<br>
      <strong>🕐 Time:</strong> {interview_time}<br>
      <strong>👤 Interviewer:</strong> {interviewer}<br>
      <strong>🎥 Format:</strong> Video Call<br>
      <strong>⏱️ Duration:</strong> 45 minutes</p>
    </div>
    <h3>📋 Preparation Checklist:</h3>
    <ul>
      <li>✅ Review the job description</li>
      <li>✅ Prepare examples of your work</li>
      <li>✅ Test your video call setup</li>
    </ul>
    <p><strong>Please confirm your availability by replying to this email.</strong></p>
    <p>Best regards,<br><strong>BHIV HR Team</strong></p>
  </div>
</body>
</html>
```

### WhatsApp Template

```
📅 *Interview Scheduled*

*Job:* {job_title}
*Date:* {interview_date}
*Time:* {interview_time}
*Interviewer:* {interviewer}

📋 *Preparation:*
• Review job description
• Prepare work examples
• Test video setup

Please confirm! 👍
```

**Interactive Buttons:**
- ✅ Confirm
- ❌ Reschedule
- ❓ More Info

---

## 5. 📝 FEEDBACK REQUEST

**Trigger:** After interview or rejection  
**Sequence Type:** `feedback_request`

### Email Template

**Subject:** 📝 Feedback Request - {job_title} | BHIV HR

**Plain Text Body:**
```
Dear {candidate_name},

Thank you for your interest in {job_title} at BHIV.

We'd love to hear about your experience with our recruitment process. Your feedback helps us improve.

Please take 2 minutes to share your thoughts:
• How was the application process?
• Was the communication clear and timely?
• Any suggestions for improvement?

Reply to this email with your feedback.

Thank you for your time!

Best regards,
BHIV HR Team
```

### WhatsApp Template

```
📝 *Feedback Request*

*Job:* {job_title}

How was your experience with BHIV?

📋 *Quick feedback:*
• Application process?
• Communication quality?
• Suggestions?

Reply with your thoughts!

_Thank you! 🙏_
```

**Interactive Buttons:**
- ⭐ Excellent
- 👍 Good
- 👎 Needs Improvement

---

## 6. ❌ REJECTION NOTIFICATION

**Trigger:** Candidate not selected after review  
**Sequence Type:** `rejection_sent`

### Email Template

**Subject:** Application Update - {job_title} | BHIV HR

**Plain Text Body:**
```
Dear {candidate_name},

Thank you for your interest in the {job_title} position at BHIV and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We were impressed by your background and encourage you to apply for future opportunities that align with your skills and experience.

Your application will remain in our system for future consideration. We'll notify you when suitable positions become available.

We wish you all the best in your job search and future endeavors.

Best regards,
BHIV HR Team
```

**HTML Body:**
```html
<html>
<body style='font-family: Arial, sans-serif; color: #333;'>
  <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
    <h2 style='color: #6c757d;'>Application Update</h2>
    <p>Dear <strong>{candidate_name}</strong>,</p>
    <p>Thank you for your interest in the <strong>{job_title}</strong> position at BHIV and for taking the time to apply.</p>
    <div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>
      <p>After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.</p>
    </div>
    <p>We were impressed by your background and encourage you to apply for future opportunities that align with your skills and experience.</p>
    <h3>💼 Future Opportunities:</h3>
    <ul>
      <li>Your application remains in our system</li>
      <li>We'll notify you of suitable positions</li>
      <li>Feel free to apply for other roles</li>
    </ul>
    <p>We wish you all the best in your job search and future endeavors.</p>
    <p>Best regards,<br><strong>BHIV HR Team</strong></p>
  </div>
</body>
</html>
```

### WhatsApp Template

```
📋 *Application Update*

*Job:* {job_title}

Thank you for applying to BHIV. After careful review, we've decided to move forward with other candidates.

💼 *Your profile remains active:*
• We'll notify you of future opportunities
• Feel free to apply for other roles

We wish you the best in your job search!

_BHIV HR Team_
```

**Interactive Buttons:** None

---

## 🔧 Template Variables Reference

All templates support the following dynamic variables:

### Required Variables
- `{candidate_name}` - Candidate's full name
- `{job_title}` - Position title
- `{candidate_email}` - Candidate's email address
- `{candidate_phone}` - Candidate's phone number

### Optional Variables
- `{application_id}` - Unique application ID (default: "N/A")
- `{matching_score}` - AI matching score 0-100 (default: "High")
- `{interview_date}` - Scheduled interview date (default: "TBD")
- `{interview_time}` - Scheduled interview time (default: "TBD")
- `{interviewer}` - Interviewer name (default: "HR Team")
- `{job_id}` - Job posting ID
- `{application_status}` - Current status (e.g., "pending", "shortlisted")

---

## 📊 Notification Delivery Channels

Each template is sent via multiple channels:

| Notification Type | Email | WhatsApp | Telegram |
|-------------------|-------|----------|----------|
| Welcome | ✅ HTML | ✅ | ❌ |
| Application Received | ✅ HTML | ✅ | ❌ |
| Shortlisted | ✅ HTML | ✅ + Buttons | ❌ |
| Interview Scheduled | ✅ HTML | ✅ + Buttons | ❌ |
| Feedback Request | ✅ Plain | ✅ + Buttons | ❌ |
| Rejection | ✅ HTML | ✅ | ❌ |

---

## 🎯 Usage in API

### Send Single Notification
```bash
POST /automation/notifications/bulk
Content-Type: application/json

{
  "candidates": [{
    "candidate_name": "John Doe",
    "candidate_email": "john@example.com",
    "candidate_phone": "+1234567890",
    "candidate_id": "candidate_123"
  }],
  "sequence_type": "welcome",
  "job_title": "Senior Developer",
  "job_id": "job_456"
}
```

### Send Bulk Notifications
```bash
POST /automation/notifications/bulk
Content-Type: application/json

{
  "candidates": [
    {"candidate_name": "John", "candidate_email": "john@example.com", ...},
    {"candidate_name": "Jane", "candidate_email": "jane@example.com", ...}
  ],
  "sequence_type": "application_received",
  "job_title": "Product Manager",
  "application_id": "APP_001"
}
```

---

## 📝 Template Customization Guide

To modify templates, edit: `backend/services/langgraph/app/communication.py`

**Lines 240-380:** Email and WhatsApp template definitions

**Best Practices:**
1. Keep subject lines under 60 characters
2. Use emojis sparingly (1-2 per template)
3. Test HTML rendering across email clients
4. Ensure mobile-friendly WhatsApp formatting
5. Include clear call-to-action in each template
6. Maintain consistent brand voice

---

## 🔐 Security & Compliance

- All templates comply with GDPR data protection
- Unsubscribe links included in production emails
- Personal data variables sanitized before sending
- Rate limiting: 100 emails/hour per candidate
- Spam prevention: Max 3 notifications per day

---

**Last Updated:** March 10, 2026  
**Version:** 1.0  
**Maintained By:** BHIV HR Platform Development Team
