from flask import Flask,render_template,request,flash,redirect,url_for
import mysql.connector
from werkzeug.security import generate_password_hash
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
            if username=='hospital1' and password=='hospital1':
                return "hospital page opened"
        else:
            cursor.execute("SELECT * FROM registered_users WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                return render_template('donar_homepage.html')
            else:
                return redirect(url_for('Login'))
    return render_template("login_donar.html")

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

if __name__ == "__main__":
    app.run(debug=True)