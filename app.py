from flask import Flask,render_template,request,flash,redirect,url_for,session,jsonify
import mysql.connector
from werkzeug.security import generate_password_hash
from email_sender import send_email
from datafilter import match
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
    session['logged_in'] = False
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
    error = None
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
                 error = "Invalid username or password for hospital login"
        else:
            cursor.execute("SELECT * FROM registered_users WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                session['logged_in'] = True
                return render_template("user_dashboard.html")
            else:
                error = "Invalid username or password for donar login"
    return error

      
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
            return "passwords not matched!!"
        else:
            try:
                session['logged_in'] = True
                cursor.execute("""Insert into registered_users(username,email,phone_number,city,blood_group,password) values(%s,%s,%s,%s,%s,%s)""",(username,email,phone_number,city,blood_group,password))
                con.commit()
                return render_template('user_dashboard.html ')
            except mysql.connector.Error as err:
                return f"Error: {err}",500
    return render_template("registration_donar.html")   

@app.route('/Dashboard', methods=['GET', 'POST'])
def Dashboard():
    return render_template("user_dashboard.html")

@app.route('/History')
def History():
    return render_template("history.html")
@app.route('/Logout')
def Logout():
    session.pop('logged_in', None) 
    return redirect(url_for('index'))

@app.route('/Contact1',methods=['GET', 'POST'])
def Contact1():
    if request.method=='POST':
        username=request.form.get('username')
        email=request.form.get('email')
        subject=request.form.get('subject')
        message=request.form.get('message')
        try:
            cursor.execute("""insert into customer_contact(username,email,subject,message) values(%s,%s,%s,%s)""",(username,email,subject,message))
            con.commit()
            return jsonify({"message": " sent successfully!"}), 200
        except mysql.connector.Error as err:
                return f"Error: {err}",500
    return redirect(url_for('Contact'))
        
        
#hospital routes

@app.route('/Donar', methods=['GET', 'POST'])
def Donar():
    # if request.method=='POST':
    #     seekername=request.form.get('seekername')
    #     city=request.form.get('city').lower()
    #     bloodgroup=request.form.get('bloodgroup').lower()
    #     cursor.execute("""select * from registered_users where city=%s and blood_group=%s """,(city,bloodgroup))
    #     results = cursor.fetchall()
    result=match()
    print("app.py")
    print(result)
    username=[i for i in result['username']]
    bloodgroup=[i for i in result['blood_group']]
    city=[i for i in result['city']]
    email=[i for i in result['email']]
    print(username)
    print(bloodgroup)
    print(city)
    print(email)
    
        
    #return render_template('hospital/donar_list.html',seekername=seekername,city=city,bloodgroup=bloodgroup,donars=results)
    return render_template('hospital/donar_list.html',u=username,b=bloodgroup,c=city,e=email)

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

@app.route('/Continue')
def Continue():
    return render_template("Continue.html")
if __name__ == "__main__":
    app.run(debug=True)