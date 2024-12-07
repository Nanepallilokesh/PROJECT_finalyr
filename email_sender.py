import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    sender_email = "lokeshnanepalli9@gmail.com"  # Replace with your Gmail address
    sender_password = "vwnamxtgixtrinrq" # Replace with your Gmail password (use App Passwords if 2FA is enabled)

    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Attach the body with the msg instance
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Establish connection to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)  # Login to Gmail's SMTP server
        
        # Send the email
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)

        print(f"Email successfully sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")
    finally:
        # Close the server connection
        server.quit()
