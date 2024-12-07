from flask import Flask,render_template,request,flash,redirect,url_for,session,jsonify
import mysql.connector
from werkzeug.security import generate_password_hash
from email_sender import send_email 
app = Flask(__name__)


app.secret_key = 'your_secret_key'
#database Configuration
db_config={
    'host':'localhost',
    'user':'root',
    'password':'Lokesh4321.',
    'database':'BloodDonation'
}

#Establish connection
con=mysql.connector.connect(**db_config)
cursor=con.cursor()



@app.route('/')
def index():
    return render_template("index.html")

@app.route('/About')
def About():
    return render_template("about.html")

@app.route('/Service')
def Service():
    return render_template("service.html")

@app.route('/Contact')
def Contact():
    return render_template("contact.html")

@app.route('/Login', methods=['GET','POST'])
def Login():
    if request.method=='POST':
        username=request.form.get('username').strip()
        user_type=request.form.get('user_type')
        password=request.form.get('password')
        if user_type=='hospital_admin':
            cursor.execute("SELECT * FROM hospital_admin WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                session['logged_in'] = True
                return render_template('/hospital/index.html')
            else:
                return redirect(url_for('Login'))
        else:
            cursor.execute("SELECT * FROM registered_users WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                session['logged_in'] = True
                return render_template("user_dashboard.html")
            else:
                return redirect(url_for('Login'))
    return redirect(url_for('index'))


@app.route('/Dashboard', methods=['GET', 'POST'])
def Dashboard():
    return render_template("user_dashboard.html")
    
    
@app.route('/Register', methods=['GET', 'POST'])
def Register():
    if request.method=='POST':
        username=request.form.get('username')
        email=request.form.get('email')
        phone_number=request.form.get('phone_number')
        city=request.form.get('city')
        blood_group=request.form.get('blood_group')
        password=request.form.get('password').strip()
        re_password=request.form.get('re_password').strip()
        if password!=re_password:
            print("hello")
            return "passwords not matched!!"
        else:
            try:
                cursor.execute("""Insert into registered_users(username,email,phone_number,city,blood_group,password) values(%s,%s,%s,%s,%s,%s)""",(username,email,phone_number,city,blood_group,password))
                con.commit()
                return render_template('donar_homepage.html ')
            except mysql.connector.Error as err:
                return f"Error: {err}",500
    return render_template("registration_donar.html")   


@app.route('/Logout')
def Logout():
    session.pop('logged_in', None) 
    return redirect(url_for('index'))


#hospital routes
@app.route('/Donar', methods=['GET', 'POST'])
def Donar():
    if request.method=='POST':
        seekername=request.form.get('seekername')
        city=request.form.get('city')
        bloodgroup=request.form.get('bloodgroup')
        cursor.execute("""select * from registered_users where city=%s and blood_group=%s """,(city,bloodgroup))
        results = cursor.fetchall()
        
    return render_template('hospital/donar_list.html',seekername=seekername,donars=results)


@app.route('/new_seeker')
def new_seeker():
    return render_template('/hospital/new_seeker.html')


@app.route('/coins_redemption')
def coins_redemption():
    return render_template('/hospital/coins_redemption.html')

@app.route('/send-email', methods=['POST'])
def send_email_route():
    # Get the data from the request
    data = request.get_json()
    to_email = data.get('to_email')  # Get the recipient's email from the request
    subject = data.get('subject')
    body = data.get('body')

    # Call the send_email function to send the email
    send_email(to_email, subject, body)

    return jsonify({"message": "Email sent successfully!"}), 200

if __name__ == "__main__":
    app.run(debug=True)