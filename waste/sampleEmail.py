import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    sender_email = "lokeshnanepalli9@gmail.com"  # Replace with your Gmail address
    sender_password = "vwnamxtgixtrinrq"  # Replace with your Gmail app password

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        print(f"Email successfully sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
    finally:
        server.quit()

# Test the function
send_email("bharadvajnanepalli2@gmail.com", "Test Subject", "This is a test email.")