import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, List
from twilio.rest import Client
from telegram import Bot
import sys
import os

# Import config from parent directory
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from config import settings
except ImportError:
    # Fallback for Docker environment
    import os
    class Settings:
        twilio_account_sid = os.getenv("TWILIO_ACCOUNT_SID", "")
        twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN", "")
        twilio_whatsapp_number = os.getenv("TWILIO_WHATSAPP_NUMBER", "+14155238886")
        gmail_email = os.getenv("GMAIL_EMAIL", "")
        gmail_app_password = os.getenv("GMAIL_APP_PASSWORD", "")
        telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "")
        environment = os.getenv("ENVIRONMENT", "development")
    settings = Settings()

logger = logging.getLogger(__name__)

class CommunicationManager:
    """Unified communication across multiple channels"""
    
    def __init__(self):
        # Always try to initialize real clients if credentials are provided
        logger.info(f"🔧 Initializing communication manager (env: {settings.environment})")
        
        # Check if we have real credentials
        has_twilio = (settings.twilio_account_sid and 
                     not settings.twilio_account_sid.startswith("<"))
        has_gmail = (settings.gmail_email and 
                    not settings.gmail_email.startswith("<"))
        has_telegram = (settings.telegram_bot_token and 
                       not settings.telegram_bot_token.startswith("<"))
        
        if has_twilio or has_gmail or has_telegram:
            logger.info("✅ Real credentials detected - initializing live services")
        else:
            logger.info("🧪 No real credentials - using development mode")
        
        # Initialize services based on available credentials
        if True:  # Always try to initialize
            try:
                # Twilio
                self.twilio_client = Client(
                    settings.twilio_account_sid,
                    settings.twilio_auth_token
                )
                logger.info("✅ Twilio client initialized")
            except Exception as e:
                logger.warning(f"⚠️ Twilio initialization failed: {e}")
                self.twilio_client = None
            
            try:
                # Telegram
                self.telegram_bot = Bot(token=settings.telegram_bot_token)
                logger.info("✅ Telegram bot initialized")
            except Exception as e:
                logger.warning(f"⚠️ Telegram initialization failed: {e}")
                self.telegram_bot = None
            
            # Gmail SMTP
            self.gmail_email = settings.gmail_email
            self.gmail_app_password = settings.gmail_app_password
            logger.info("✅ Gmail SMTP configured")
    
    async def send_whatsapp(self, phone: str, message: str) -> Dict:
        """Send WhatsApp message via Twilio"""
        try:
            # Check if we have real Twilio credentials
            if not self.twilio_client:
                logger.info(f"🧪 MOCK WhatsApp to {phone}: {message[:50]}...")
                return {"status": "mock_sent", "channel": "whatsapp", "message_id": "mock_msg_123", "recipient": phone, "note": "Mock mode - add real Twilio credentials to send actual messages"}
            
            # Normalize Indian phone number formats - Works with real phone numbers
            original_phone = phone
            phone = phone.replace(' ', '').replace('-', '').replace('(', '').replace(')', '')  # Remove spaces, dashes, parentheses
            
            # Handle different Indian number formats
            if phone.startswith('91') and len(phone) == 12:  # 919284967526
                phone = '+' + phone
            elif phone.startswith('+91') and len(phone) == 13:  # +919284967526 (correct)
                pass  # Already correct
            elif len(phone) == 10 and phone.isdigit():  # 9284967526 (10 digits - Indian format)
                phone = '+91' + phone
            elif phone.startswith('+9') and len(phone) == 11:  # +9284967526 (missing 1)
                phone = '+91' + phone[1:]  # Keep the 9
            elif not phone.startswith('+') and len(phone) >= 10:
                # Default to Indian format if no country code
                if phone.isdigit() and len(phone) == 10:
                    phone = f"+91{phone}"
                else:
                    phone = f"+{phone}"  # Add + if missing
            
            if phone != original_phone:
                logger.info(f"🔧 Normalized phone: {original_phone} → {phone}")
            
            logger.info(f"📱 Sending WhatsApp to: {phone}")
            
            msg = self.twilio_client.messages.create(
                from_=f"whatsapp:{settings.twilio_whatsapp_number}",
                to=f"whatsapp:{phone}",
                body=message
            )
            
            logger.info(f"✅ WhatsApp sent to {phone}: {msg.sid}")
            
            # Check message status immediately
            try:
                import time
                time.sleep(1)  # Wait 1 second
                updated_msg = self.twilio_client.messages(msg.sid).fetch()
                if updated_msg.status == 'failed':
                    error_msg = f"Message failed - Error {updated_msg.error_code}: {updated_msg.error_message or 'Phone number not verified in Twilio sandbox'}"
                    logger.error(f"❌ {error_msg}")
                    return {"status": "failed", "channel": "whatsapp", "error": error_msg, "recipient": phone, "message_id": msg.sid}
                else:
                    logger.info(f"📊 Message status: {updated_msg.status}")
            except Exception as status_error:
                logger.warning(f"⚠️ Could not check message status: {status_error}")
            
            return {"status": "success", "channel": "whatsapp", "message_id": msg.sid, "recipient": phone}
        except Exception as e:
            logger.error(f"❌ WhatsApp error for {phone}: {str(e)}")
            return {"status": "failed", "channel": "whatsapp", "error": str(e), "recipient": phone}
    
    async def send_email(self, recipient_email: str, subject: str, body: str, html_body: str = None) -> Dict:
        """Send email via Gmail SMTP - Works with real email addresses without 2FA"""
        try:
            # Check if we have real Gmail credentials
            if (not self.gmail_email or 
                not self.gmail_app_password or 
                self.gmail_email.startswith("<")):
                logger.info(f"🧪 MOCK Email to {recipient_email}: {subject}")
                return {"status": "mock_sent", "channel": "email", "recipient": recipient_email, "subject": subject, "note": "Mock mode - configure Gmail credentials in environment variables"}
            
            # Validate email format
            import re
            email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(email_pattern, recipient_email):
                return {"status": "failed", "channel": "email", "error": "Invalid email format", "recipient": recipient_email}
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.gmail_email
            msg['To'] = recipient_email
            
            msg.attach(MIMEText(body, 'plain'))
            if html_body:
                msg.attach(MIMEText(html_body, 'html'))
            
            # Use Gmail SMTP with app password (works without 2FA if app password is configured)
            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(self.gmail_email, self.gmail_app_password)
                server.send_message(msg)
            
            logger.info(f"✅ Email sent to {recipient_email}: {subject}")
            return {"status": "success", "channel": "email", "recipient": recipient_email, "subject": subject}
        except smtplib.SMTPAuthenticationError as e:
            logger.error(f"❌ Gmail authentication error: {str(e)}")
            return {"status": "failed", "channel": "email", "error": f"Gmail authentication failed: {str(e)}. Ensure Gmail App Password is configured correctly.", "recipient": recipient_email}
        except Exception as e:
            logger.error(f"❌ Email error for {recipient_email}: {str(e)}")
            return {"status": "failed", "channel": "email", "error": str(e), "recipient": recipient_email}
    
    async def send_telegram(self, chat_id: str, message: str) -> Dict:
        """Send Telegram message"""
        try:
            if not self.telegram_bot:
                logger.info(f"🧪 MOCK Telegram to {chat_id}: {message[:50]}...")
                return {"status": "mock_sent", "channel": "telegram", "message_id": "mock_tg_123", "recipient": chat_id, "note": "Mock mode - add real Telegram bot token to send actual messages"}
            
            msg = await self.telegram_bot.send_message(
                chat_id=chat_id,
                text=message,
                parse_mode='Markdown'
            )
            
            logger.info(f"✅ Telegram message sent to {chat_id}: {msg.message_id}")
            return {"status": "success", "channel": "telegram", "message_id": msg.message_id, "recipient": chat_id}
        except Exception as e:
            logger.error(f"❌ Telegram error for {chat_id}: {str(e)}")
            return {"status": "failed", "channel": "telegram", "error": str(e), "recipient": chat_id}
    
    async def send_telegram_with_keyboard(self, chat_id: str, message: str, keyboard_options: List[str] = None) -> Dict:
        """Send Telegram message with inline keyboard for interactive responses"""
        try:
            if not self.telegram_bot:
                logger.info(f"🧪 MOCK Telegram with keyboard to {chat_id}: {message[:50]}...")
                return {"status": "mock_sent", "channel": "telegram", "message_id": "mock_tg_kb_123", "recipient": chat_id}
            
            from telegram import InlineKeyboardButton, InlineKeyboardMarkup
            
            keyboard = None
            if keyboard_options:
                keyboard_buttons = [[InlineKeyboardButton(option, callback_data=option.lower().replace(' ', '_'))] for option in keyboard_options]
                keyboard = InlineKeyboardMarkup(keyboard_buttons)
            
            msg = await self.telegram_bot.send_message(
                chat_id=chat_id,
                text=message,
                parse_mode='Markdown',
                reply_markup=keyboard
            )
            
            logger.info(f"✅ Telegram message with keyboard sent to {chat_id}: {msg.message_id}")
            return {"status": "success", "channel": "telegram", "message_id": msg.message_id, "recipient": chat_id}
        except Exception as e:
            logger.error(f"❌ Telegram keyboard error for {chat_id}: {str(e)}")
            return {"status": "failed", "channel": "telegram", "error": str(e), "recipient": chat_id}
    
    async def send_whatsapp_with_buttons(self, phone: str, message: str, button_options: List[str] = None) -> Dict:
        """Send WhatsApp message with interactive buttons (Twilio limitation: text-based options)"""
        try:
            if not self.twilio_client:
                logger.info(f"🧪 MOCK WhatsApp with buttons to {phone}: {message[:50]}...")
                return {"status": "mock_sent", "channel": "whatsapp", "message_id": "mock_wa_btn_123", "recipient": phone}
            
            # Add button options as numbered list (Twilio WhatsApp limitation)
            if button_options:
                message += "\n\n📋 *Quick Actions:*\n"
                for i, option in enumerate(button_options, 1):
                    message += f"{i}. {option}\n"
                message += "\n_Reply with the number of your choice_"
            
            return await self.send_whatsapp(phone, message)
        except Exception as e:
            logger.error(f"❌ WhatsApp buttons error for {phone}: {str(e)}")
            return {"status": "failed", "channel": "whatsapp", "error": str(e), "recipient": phone}
    
    async def send_automated_sequence(self, payload: Dict, sequence_type: str) -> List[Dict]:
        """Send automated email/WhatsApp sequences based on triggers"""
        results = []
        
        sequences = {
            "application_received": {
                "email": {
                    "subject": f"✅ Application Received - {payload['job_title']} | BHIV HR",
                    "body": f"""Dear {payload['candidate_name']},\n\nThank you for applying to {payload['job_title']} at BHIV.\n\nYour application is under review. We'll contact you within 3-5 business days.\n\nApplication ID: {payload.get('application_id', 'N/A')}\n\nNext Steps:\n• AI screening in progress\n• HR review within 24-48 hours\n• Interview scheduling if shortlisted\n\nBest regards,\nBHIV HR Team""",
                    "html_body": f"""<html><body style='font-family: Arial, sans-serif; color: #333;'>\n<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>\n<h2 style='color: #2c5aa0;'>✅ Application Received</h2>\n<p>Dear <strong>{payload['candidate_name']}</strong>,</p>\n<p>Thank you for applying to <strong>{payload['job_title']}</strong> at BHIV.</p>\n<div style='background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;'>\n<h3>Application Details:</h3>\n<p><strong>Position:</strong> {payload['job_title']}<br>\n<strong>Application ID:</strong> {payload.get('application_id', 'N/A')}<br>\n<strong>Status:</strong> Under Review</p>\n</div>\n<h3>Next Steps:</h3>\n<ul>\n<li>🤖 AI screening in progress</li>\n<li>👥 HR review within 24-48 hours</li>\n<li>📅 Interview scheduling if shortlisted</li>\n</ul>\n<p>Best regards,<br><strong>BHIV HR Team</strong></p>\n</div></body></html>"""
                },
                "whatsapp": f"""🎯 *Application Received*\n\n*Position:* {payload['job_title']}\n*Application ID:* {payload.get('application_id', 'N/A')}\n*Status:* Under Review\n\n📋 *Next Steps:*\n• AI screening in progress\n• HR review within 24-48 hours\n\nWe'll update you within 3-5 days!\n\n_BHIV HR Team_"""
            },
            "interview_scheduled": {
                "email": {
                    "subject": f"📅 Interview Scheduled - {payload['job_title']} | BHIV HR",
                    "body": f"""Dear {payload['candidate_name']},\n\nYour interview is scheduled!\n\n📅 Date: {payload.get('interview_date', 'TBD')}\n🕐 Time: {payload.get('interview_time', 'TBD')}\n👤 Interviewer: {payload.get('interviewer', 'HR Team')}\n🎥 Format: Video Call\n⏱️ Duration: 45 minutes\n\nInterview Preparation:\n• Review the job description\n• Prepare examples of your work\n• Test your video call setup\n\nPlease confirm your availability by replying to this email.\n\nBest regards,\nBHIV HR Team""",
                    "html_body": f"""<html><body style='font-family: Arial, sans-serif; color: #333;'>\n<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>\n<h2 style='color: #28a745;'>📅 Interview Scheduled</h2>\n<p>Dear <strong>{payload['candidate_name']}</strong>,</p>\n<p>Your interview for <strong>{payload['job_title']}</strong> is confirmed!</p>\n<div style='background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;'>\n<h3>Interview Details:</h3>\n<p><strong>📅 Date:</strong> {payload.get('interview_date', 'TBD')}<br>\n<strong>🕐 Time:</strong> {payload.get('interview_time', 'TBD')}<br>\n<strong>👤 Interviewer:</strong> {payload.get('interviewer', 'HR Team')}<br>\n<strong>🎥 Format:</strong> Video Call<br>\n<strong>⏱️ Duration:</strong> 45 minutes</p>\n</div>\n<h3>📋 Preparation Checklist:</h3>\n<ul>\n<li>✅ Review the job description</li>\n<li>✅ Prepare examples of your work</li>\n<li>✅ Test your video call setup</li>\n</ul>\n<p><strong>Please confirm your availability by replying to this email.</strong></p>\n<p>Best regards,<br><strong>BHIV HR Team</strong></p>\n</div></body></html>"""
                },
                "whatsapp": f"""📅 *Interview Scheduled*\n\n*Job:* {payload['job_title']}\n*Date:* {payload.get('interview_date', 'TBD')}\n*Time:* {payload.get('interview_time', 'TBD')}\n*Interviewer:* {payload.get('interviewer', 'HR Team')}\n\n📋 *Preparation:*\n• Review job description\n• Prepare work examples\n• Test video setup\n\nPlease confirm! 👍"""
            },
            "shortlisted": {
                "email": {
                    "subject": f"🎉 Congratulations! Shortlisted - {payload['job_title']} | BHIV HR",
                    "body": f"""Dear {payload['candidate_name']},\n\n🎉 Congratulations! You've been shortlisted for {payload['job_title']}!\n\nOur AI matching system scored your profile highly based on:\n• Technical skills alignment\n• Experience relevance\n• Cultural fit assessment\n\nMatching Score: {payload.get('matching_score', 'High')}/100\n\nNext Steps:\n• Our HR team will contact you within 24 hours\n• Interview scheduling will follow\n• Please keep your calendar flexible\n\nWe're excited about the possibility of you joining our team!\n\nBest regards,\nBHIV HR Team""",
                    "html_body": f"""<html><body style='font-family: Arial, sans-serif; color: #333;'>\n<div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>\n<h2 style='color: #ffc107;'>🎉 Congratulations! You're Shortlisted!</h2>\n<p>Dear <strong>{payload['candidate_name']}</strong>,</p>\n<p>We're excited to inform you that you've been <strong>shortlisted</strong> for the <strong>{payload['job_title']}</strong> position!</p>\n<div style='background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;'>\n<h3>🎯 AI Assessment Results:</h3>\n<p><strong>Matching Score:</strong> {payload.get('matching_score', 'High')}/100<br>\n<strong>Technical Skills:</strong> Excellent alignment<br>\n<strong>Experience:</strong> Highly relevant<br>\n<strong>Cultural Fit:</strong> Strong match</p>\n</div>\n<h3>🚀 Next Steps:</h3>\n<ul>\n<li>📞 HR team will contact you within 24 hours</li>\n<li>📅 Interview scheduling will follow</li>\n<li>🗓️ Please keep your calendar flexible</li>\n</ul>\n<p><strong>We're excited about the possibility of you joining our team!</strong></p>\n<p>Best regards,<br><strong>BHIV HR Team</strong></p>\n</div></body></html>"""
                },
                "whatsapp": f"""🎉 *SHORTLISTED!*\n\n*Job:* {payload['job_title']}\n*AI Score:* {payload.get('matching_score', 'High')}/100\n\n🎯 *Why you were selected:*\n• Technical skills alignment\n• Experience relevance\n• Cultural fit assessment\n\n📞 We'll call you within 24 hours!\n\n_Congratulations! 🎊_"""
            },
            "feedback_request": {
                "email": {
                    "subject": f"📝 Feedback Request - {payload['job_title']} | BHIV HR",
                    "body": f"""Dear {payload['candidate_name']},\n\nThank you for your interest in {payload['job_title']} at BHIV.\n\nWe'd love to hear about your experience with our recruitment process. Your feedback helps us improve.\n\nPlease take 2 minutes to share your thoughts:\n• How was the application process?\n• Was the communication clear and timely?\n• Any suggestions for improvement?\n\nReply to this email with your feedback.\n\nThank you for your time!\n\nBest regards,\nBHIV HR Team"""
                },
                "whatsapp": f"""📝 *Feedback Request*\n\n*Job:* {payload['job_title']}\n\nHow was your experience with BHIV?\n\n📋 *Quick feedback:*\n• Application process?\n• Communication quality?\n• Suggestions?\n\nReply with your thoughts!\n\n_Thank you! 🙏_"""
            }
        }
        
        sequence = sequences.get(sequence_type, sequences["application_received"])
        
        # Send email - use provided email or skip
        candidate_email = payload.get('candidate_email')
        if candidate_email and candidate_email != "test@example.com":
            email_result = await self.send_email(
                candidate_email,
                sequence["email"]["subject"],
                sequence["email"]["body"]
            )
            results.append(email_result)
        else:
            logger.info("Skipping email - no valid email provided")
        
        # Send WhatsApp with interactive options for certain sequences
        candidate_phone = payload.get('candidate_phone')
        if candidate_phone and candidate_phone != "+1234567890":
            if sequence_type == "interview_scheduled":
                whatsapp_result = await self.send_whatsapp_with_buttons(
                    payload['candidate_phone'],
                    sequence["whatsapp"],
                    ["✅ Confirm", "❌ Reschedule", "❓ More Info"]
                )
            elif sequence_type == "shortlisted":
                whatsapp_result = await self.send_whatsapp_with_buttons(
                    payload['candidate_phone'],
                    sequence["whatsapp"],
                    ["🎉 Excited!", "📅 Schedule Interview", "❓ Questions"]
                )
            elif sequence_type == "feedback_request":
                whatsapp_result = await self.send_whatsapp_with_buttons(
                    payload['candidate_phone'],
                    sequence["whatsapp"],
                    ["⭐ Excellent", "👍 Good", "👎 Needs Improvement"]
                )
            else:
                whatsapp_result = await self.send_whatsapp(payload['candidate_phone'], sequence["whatsapp"])
            results.append(whatsapp_result)
        
        return results
    
    async def send_multi_channel(self, payload: Dict, channels: List[str]) -> List[Dict]:
        """Send notification across multiple channels"""
        results = []
        
        if "email" in channels:
            email_body = f"""Dear {payload['candidate_name']},

We have an update regarding your application for the position of {payload['job_title']} at BHIV.

Application Status: {payload['application_status'].upper()}

{payload['message']}

If you have any questions, please feel free to contact us.

Best regards,
BHIV HR Team"""
            result = await self.send_email(
                payload['candidate_email'],
                f"BHIV HR - {payload['job_title']} - {payload['application_status'].upper()}",
                email_body
            )
            results.append(result)
        
        if "whatsapp" in channels:
            whatsapp_msg = f"""*📢 BHIV HR Update*

*Job:* {payload['job_title']}
*Status:* {payload['application_status'].upper()}

{payload['message']}

_Thank you for your interest!_"""
            result = await self.send_whatsapp(payload['candidate_phone'], whatsapp_msg)
            results.append(result)
        
        if "telegram" in channels:
            # Try to send Telegram if chat_id is available
            chat_id = payload.get('candidate_telegram_id') or payload.get('telegram_chat_id')
            if chat_id:
                telegram_msg = f"""🔔 *BHIV HR Update*

*Job:* {payload['job_title']}
*Status:* {payload['application_status'].upper()}

{payload['message']}

_Thank you for your interest in BHIV!_"""
                result = await self.send_telegram(chat_id, telegram_msg)
                results.append(result)
            else:
                logger.info("ℹ️ Telegram skipped - no chat_id provided")
                results.append({"status": "skipped", "channel": "telegram", "reason": "No chat_id provided"})
        
        return results
    
    async def trigger_workflow_automation(self, event_type: str, payload: Dict) -> Dict:
        """Trigger automated workflows based on events"""
        try:
            logger.info(f"🔄 Triggering automation for event: {event_type}")
            
            automation_results = []
            
            # Event-driven automation triggers
            if event_type == "application_submitted":
                results = await self.send_automated_sequence(payload, "application_received")
                automation_results.extend(results)
            
            elif event_type == "candidate_shortlisted" or event_type == "hr_shortlisted":
                results = await self.send_automated_sequence(payload, "shortlisted")
                automation_results.extend(results)
                # Notify HR dashboard
                await self._notify_portal_update("hr", "candidate_shortlisted", payload)
            
            elif event_type == "interview_scheduled" or event_type == "client_scheduled":
                results = await self.send_automated_sequence(payload, "interview_scheduled")
                automation_results.extend(results)
                # Notify all portals
                await self._notify_portal_update("all", "interview_scheduled", payload)
            
            elif event_type == "candidate_feedback_submitted":
                results = await self.send_automated_sequence(payload, "feedback_request")
                automation_results.extend(results)
                # Notify HR portal
                await self._notify_portal_update("hr", "feedback_received", payload)
            
            elif event_type == "status_inquiry":
                # Handle candidate status inquiries via WhatsApp
                if payload.get('candidate_phone'):
                    status_msg = f"""📊 *Application Status*\n\n*Job:* {payload['job_title']}\n*Current Status:* {payload.get('current_status', 'Under Review')}\n*Last Updated:* {payload.get('last_updated', 'Recently')}\n\n_We'll notify you of any changes!_"""
                    result = await self.send_whatsapp_with_buttons(
                        payload['candidate_phone'],
                        status_msg,
                        ["📧 Email Update", "📞 Call Request", "✅ Thanks"]
                    )
                    automation_results.append(result)
            
            elif event_type == "bulk_notification":
                # Handle bulk notifications to multiple candidates
                candidates = payload.get('candidates', [])
                for candidate in candidates:
                    candidate_payload = {**payload, **candidate}
                    results = await self.send_automated_sequence(candidate_payload, payload.get('sequence_type', 'application_received'))
                    automation_results.extend(results)
            
            logger.info(f"✅ Automation completed: {len(automation_results)} notifications sent")
            
            return {
                "status": "success",
                "event_type": event_type,
                "notifications_sent": len(automation_results),
                "results": automation_results
            }
        
        except Exception as e:
            logger.error(f"❌ Automation error for {event_type}: {str(e)}")
            return {"status": "failed", "event_type": event_type, "error": str(e)}
    
    async def _notify_portal_update(self, portal_type: str, event_type: str, payload: Dict):
        """Notify portals of updates for real-time synchronization"""
        try:
            from datetime import datetime
            # This would integrate with WebSocket or Server-Sent Events
            # For now, we'll log the portal notification
            logger.info(f"🔄 Portal notification: {portal_type} - {event_type}")
            
            notification_data = {
                "portal": portal_type,
                "event": event_type,
                "candidate_id": payload.get('candidate_id'),
                "job_id": payload.get('job_id'),
                "timestamp": datetime.now().isoformat(),
                "data": payload
            }
            
            # In a real implementation, this would send to WebSocket connections
            # or trigger dashboard refresh APIs
            logger.info(f"📱 Portal update sent: {notification_data}")
            
        except Exception as e:
            logger.error(f"❌ Portal notification error: {str(e)}")
    
    async def send_bulk_notifications(self, candidates: List[Dict], sequence_type: str, job_data: Dict) -> Dict:
        """Send bulk notifications to multiple candidates"""
        try:
            logger.info(f"📨 Sending bulk notifications to {len(candidates)} candidates")
            
            results = []
            success_count = 0
            failed_count = 0
            
            for candidate in candidates:
                try:
                    payload = {
                        **job_data,
                        "candidate_name": candidate.get('name', 'Candidate'),
                        "candidate_email": candidate.get('email', ''),
                        "candidate_phone": candidate.get('phone', ''),
                        "candidate_id": candidate.get('id')
                    }
                    
                    candidate_results = await self.send_automated_sequence(payload, sequence_type)
                    results.extend(candidate_results)
                    
                    # Count successes
                    for result in candidate_results:
                        if result.get('status') == 'success':
                            success_count += 1
                        else:
                            failed_count += 1
                            
                except Exception as candidate_error:
                    logger.error(f"❌ Bulk notification error for candidate {candidate.get('id')}: {str(candidate_error)}")
                    failed_count += 1
            
            logger.info(f"✅ Bulk notifications completed: {success_count} success, {failed_count} failed")
            
            return {
                "status": "completed",
                "total_candidates": len(candidates),
                "success_count": success_count,
                "failed_count": failed_count,
                "results": results
            }
            
        except Exception as e:
            logger.error(f"❌ Bulk notification error: {str(e)}")
            return {"status": "failed", "error": str(e)}

# Singleton instance
comm_manager = CommunicationManager()