import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to_email, subject, body):
    sender_email = "lokeshnanepalli9@gmail.com"  
    sender_password = "vwnamxtgixtrinrq"

    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = to_email
    msg['Subject'] = subject


    # Attach the body with the msg instance
    msg.attach(MIMEText(body, 'html'))

    try:
        # Establish connection to Gmail's SMTP server
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()  # Secure the connection
        server.login(sender_email, sender_password)  # Login to Gmail's SMTP server
        
        # Send the email
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
    finally:
        # Close the server connection
        server.quit()
