import random
import string
from datetime import date
from flask import Flask,render_template,request,flash,redirect,url_for,session,jsonify
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash
from email_sender import send_email
from datafilter import match
import pickle
import numpy as np

app = Flask(__name__)


app.secret_key = 'your_secret_key'
#database Configuration
db_config={
    'host':'127.0.0.1',
    'user':'root',
    'password':'Lokesh4321.',
    'database':'BloodDonation',
    'ssl_disabled': True,
    'use_pure':True,
}

#Establish connection
con=mysql.connector.connect(**db_config)
cursor=con.cursor()
cursor2=con.cursor()




@app.route('/')
def index():
    session['logged_in'] = False
    return render_template("index.html")

@app.route('/Home')
def Home():
    return render_template("home.html")
@app.route('/Diet')
def Diet():
    return render_template("dietSuggest.html")
@app.route('/About')
def About():
    return render_template("about.html")

@app.route('/Service')
def Service():
    return render_template("service.html")

@app.route('/Contact')
def Contact():
    return render_template("contact.html")

@app.route('/Loginpage')
def Loginpage():
    return render_template("/userLogin/login.html")

@app.route('/HospitalHome')
def HospitalHome():
    return render_template("/hospital/home.html")

@app.route('/HospitalSeeker')
def HospitalSeeker():
    return render_template("/hospital/seeker.html")

@app.route('/Coins')
def Coins():
    return render_template("coins.html")
    
@app.route('/History')
def History():
    return render_template("history.html")

@app.route('/donarList')
def donarList():
    return render_template("history.html")

@app.route('/Login', methods=['GET','POST'])
def Login():
    error = None
    if request.method=='POST':
        username=request.form.get('username').strip()
        user_type=request.form.get('userType')
        password=request.form.get('password')
        if user_type=='hospital_admin':
            cursor.execute("SELECT * FROM hospital_admin WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                session['logged_in'] = True
                return render_template('/hospital/index.html')
            else:
                return render_template('/userLogin/login.html',error="failed")
                #error = "Invalid username or password for hospital login"
        else:
            cursor.execute("SELECT * FROM registered_users WHERE username=%s AND password=%s", (username, password))
            user=cursor.fetchone()
            if user:
                session['logged_in'] = True
                return render_template("index.html")
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
            return "password not matched!!"
        else:
            try:
                session['logged_in'] = True
                print(session['logged_in'])
                cursor.execute("""Insert into registered_users(username,email,phone_number,city,blood_group,password) values(%s,%s,%s,%s,%s,%s)""",(username,email,phone_number,city,blood_group,password))
                con.commit()
                return render_template('index.html')
            except mysql.connector.Error as err:
                return f"Error: {err}",500
            
    return render_template("/userLogin/login.html")   

@app.route('/Dashboard', methods=['GET', 'POST'])
def Dashboard():
    return render_template("user_dashboard.html")

@app.route('/Logout')
def Logout():
    session['logged_in']=False
    return render_template("index.html")

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
    seekername = request.json.get('seekername')
    tempBloodGroup = request.json.get('bloodgroup')

    print(f"Received blood group: {tempBloodGroup}")

    city = request.json.get('city')

    result=match(tempBloodGroup,city)
    print(f"result-->",result)
    username=[i for i in result['username']]
    bloodgroup=[i for i in result['blood_group']]
    city=[i for i in result['city']]
    email=[i for i in result['email']]
    data = {
        "username": username,
        "bloodgroup": bloodgroup,
        "city": city,
        "email":email
    }

    
    #return render_template('hospital/donar_list.html',userName=username,bloodGroup=bloodgroup,city=city,email=email,seekerName=seekername)
    #return username,bloodgroup,city,email,seekerName
    return jsonify(data)


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

@app.route('/storeRequestDetails', methods=['POST'])
def storeRequestDetails():
    # Get the data from the request
    userName =  request.json.get('userName')
    bloodGroup=  request.json.get('bloodGroup')
    city=  request.json.get('city')
    email=  request.json.get('email')
    seekerName=  request.json.get('seekerName')
    if not all([userName, bloodGroup, city, email, seekerName]):
        return jsonify({"message": "All fields are required."}), 400
    if(userName=='' or bloodGroup == '' or city == '' or email == '' or seekerName == ''):
        return jsonify({"message": "All lists must have the some value."}), 400
    # Ensure all lists are of the same length
    if not (len(userName) == len(bloodGroup) == len(city) == len(email)):
        return jsonify({"message": "All lists must have the same number of elements."}), 400

    # Generate a random request ID
    request_id = generate_random_id()

    # Insert data into the requestSeekerDetails table
    try:
        # Insert data into the table
        for i in range(len(userName)):
            cursor.execute("""
            INSERT INTO requestseekerdetails1 (requestId, userName, bloodGroup, city, email, seekerName)
            VALUES (%s, %s, %s, %s, %s, %s)
                """, (request_id, userName[i], bloodGroup[i], city[i], email[i], seekerName))

        con.commit()  # Commit transaction


        return jsonify({"message": "Successfully stored data!", "requestId": request_id}), 200

    except Error as e:
        print(f"Error: {e}")
        return jsonify({"message": "Failed to Store Data", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error-1: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@app.route('/sendReturnEmail', methods=['POST'])
def sendReturnEmail():
    data = request.json
    email = data.get('to_email')
    subject = data.get('subject')
    body = data.get('body')
    try:
        # Use your preferred email-sending library (e.g., smtplib, boto3 SES)
       
       
        send_email(email, subject, body)  # Custom function
        return jsonify({"message": f"Email sent to {email}"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to send email", "error": str(e)}), 500

def generate_random_id(length=8):
    """Generate a random alphanumeric ID."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@app.route('/requestedDonar', methods=['GET', 'POST'])
def requestedDonar():
    try:
        # Get seekername from the request
        seekername = request.json.get('seekername')

        # Use dictionary cursor to get results as dictionaries
        cursor1 = con.cursor(dictionary=True)

        # Query to fetch records based on seekername
        query = """
            SELECT userName AS username, bloodGroup AS blood_group, city, email
            FROM requestseekerdetails1
            WHERE seekerName = %s
        """
        cursor1.execute(query, [seekername])

        # Fetch all records
        result = cursor1.fetchall()

        # Close the cursor and connection
        cursor1.close()

        # Extract data into separate lists
        username = [record['username'] for record in result]
        bloodgroup = [record['blood_group'] for record in result]
        city = [record['city'] for record in result]
        email = [record['email'] for record in result]

        # Prepare the response data
        data = {
            "username": username,
            "bloodgroup": bloodgroup,
            "city": city,
            "email": email
        }

        # Return the data as JSON
        return jsonify(data), 200

    except Error as e:
        print(f"Error while fetching records: {e}")
        return jsonify({"message": "Failed to fetch records", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error-2: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@app.route('/Continue')
def Continue():
    return render_template("Continue.html")

@app.route('/updateRequestRecord', methods=['POST'])
def update_request_record():
    try:
        # Get seekerName from the request
        seeker_name = request.json.get('seekerName')

        # Validate input
        if not seeker_name:
            return jsonify({"message": "seekerName is required"}), 400

        # Query to delete records based on seekerName
        query = """
            DELETE FROM requestseekerdetails1
            WHERE seekerName = %s
        """
        cursor.execute(query, [seeker_name])

        # Commit the changes
        con.commit()

        # Check if any rows were deleted
        if cursor.rowcount > 0:
            message = f"Records for seekerName '{seeker_name}' deleted successfully!"
        else:
            message = f"No records found for seekerName '{seeker_name}'."

        

        # Return success response
        return jsonify({"message": message}), 200

    except mysql.connector.Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"message": "Failed to update records in up", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error-3: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@app.route('/updateDonarPoints', methods=['POST'])
def updateDonarPoints():
    #cursor=con.cursor()
    print("hai in updateDonarPoints")
    userName = request.json.get('userName')
    bloodGroup = request.json.get('bloodGroup')
    city = request.json.get('city')
    email = request.json.get('email')

        # if not userName or not bloodGroup or not city or not email:
        #     return jsonify({"message": "All fields are required."}), 400
    try:
        cursor2.execute("SELECT coins FROM usercoins WHERE userName = %s", (userName,))
        result_coins = cursor2.fetchone()
        print("result_coins",result_coins)
        if result_coins is None:
            coins = 0  # Default if no record found
        else:
            coins_data = result_coins[0]

            if isinstance(coins_data, (bytes, bytearray)) and len(coins_data) > 0:
                coins = int.from_bytes(coins_data, byteorder="big")
            else:
                coins = int(coins_data) if coins_data else 0  # Default to 0 if empty

        print("Raw coins data:", coins_data, type(coins_data))
        print("coins is", coins)
    except Exception as e:
        print(f"Unexpected error-4(2): {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500


    try:  
        
            print(f"Fetching user ID for email: {email}")
            print("current_points",coins)
            cursor = con.cursor()
            cursor.execute("SELECT id FROM registered_users WHERE email = %s", (email,))
            result_userId = cursor.fetchone()

            if not result_userId:
                return jsonify({"message": "No matching user found."}), 404

            userId = int(result_userId[0])
            new_points = coins + 100  # Add 100 to the existing coins

            print("Updating donor history...")
            cursor.execute("""
                INSERT INTO donarsHistory (userId, userName, bloodGroup, city, email, date)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (userId, userName, bloodGroup, city, email, date.today()))

            if coins == 0:
                print("Inserting new record in userCoins...")
                cursor.execute("""
                    INSERT INTO usercoins (userId, userName, bloodGroup, city, email, coins)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (userId, userName, bloodGroup, city, email, new_points))
            else:
                print(f"Updating userCoins with new points: {new_points}")
                cursor.execute("UPDATE usercoins SET coins = %s WHERE userId = %s", (new_points, userId))

            con.commit()
            print("Database updated successfully.")

            return jsonify({
                "message": f"Redeem points updated for user '{userName}'.",
                "userName": userName,
                "newPoints": new_points
            }), 200

    except mysql.connector.Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"message": "Database error", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error-4: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500



@app.route('/fetchCoin', methods=['POST'])
def fetch_Coins():
    try:
        # Get details from the request
        userId = request.json.get('userId')
        userName = request.json.get('userName')

        print('userId:',userId)
        print('userName:',userName)

        # Validate input
        if not userName or not userId :
            return jsonify({"message": "All fields (userName, userId) are required."}), 400

        
        # Query to fetch redeem points for the given userName
        query_points = "SELECT coins FROM userCoins WHERE userName = %s and userId = %s"
        cursor.execute(query_points, [userName,userId])
        result_points = cursor.fetchone()

        print("result:",result_points)
        if result_points:
            return jsonify({
                "message": f"Redeem points updated for user '{userName}'.",
                "newPoints": result_points[0]
                }), 200
        else:
            return jsonify({"message": "No matching records found for the provided userName or email."}), 404

    except mysql.connector.Error as e:
        print(f"MySQL Error: {e}")
        return jsonify({"message": "Failed to update records in fetch_coins", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error-5: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500

@app.route('/fetchUserHistoryDetails', methods=['GET', 'POST'])
def fetch_User_History():
    try:
        # Get seekername from the request
        userId = request.json.get('userId')
        userName = request.json.get('userName')

        # Use dictionary cursor to get results as dictionaries
        print('userId:',userId)
        print('userName:',userName)

        cursor1 = con.cursor(dictionary=True)

        # Query to fetch records based on seekername
        query = """
            SELECT userName, bloodGroup , city, email ,date
            FROM donarsHistory
            WHERE userName = %s
        """
        cursor1.execute(query, [userName])

        # Fetch all records
        result = cursor1.fetchall()

        print("result:")
        print(result)
    

        # Extract data into separate lists
        userName = [record['userName'] for record in result]
        bloodGroup = [record['bloodGroup'] for record in result]
        city = [record['city'] for record in result]
        email = [record['email'] for record in result]
        date = [record['date'] for record in result]

        # Prepare the response data
        data = {
            "userName": userName,
            "bloodGroup": bloodGroup,
            "city": city,
            "email": email,
            "date" : date
        }

        # Return the data as JSON
        return jsonify(data), 200

    except Error as e:
        print(f"Error while fetching records: {e}")
        return jsonify({"message": "Failed to fetch records", "error": str(e)}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected error occurred", "error": str(e)}), 500



# Step 1: Load the trained model and encoders
model = pickle.load(open('donor_meal_model.pkl', 'rb'))
encoders = {
    'gender': pickle.load(open('gender_encoder.pkl', 'rb')),
    'side_effects': pickle.load(open('side_effects_encoder.pkl', 'rb')),
    'health_conditions': pickle.load(open('health_conditions_encoder.pkl', 'rb')),
    'preferences': pickle.load(open('preferences_encoder.pkl', 'rb')),
    'meal': pickle.load(open('meal_encoder.pkl', 'rb'))
}

@app.route('/recommend_food', methods=['POST'])
def recommend_food():
    try:
        # Handle the diet plan selection
        plan = request.form.get('diet_plan', '')
        if plan == 'no':
            return render_template('home.html')

        # Get input data from the form
        age = int(request.form.get('age', 0))  # Default age to 0 if missing
        gender = request.form.get('gender', 'male')  # Default gender if not provided
        gender_encoded = encoders['gender'].transform([gender])[0]

        # Handle preferences
        preferences = request.form.get('preferences', 'veg')  # Default to 'veg' if not provided
        preferences_encoded = encoders['preferences'].transform([preferences])[0]

        # Handle side effects and health conditions
        side_effects = request.form.get('side_effects', 'None')  # Default to 'None' if not provided
        if side_effects == '':
            side_effects = 'None'  # Treat empty string as 'None'
        side_effects_encoded = 0  # Default encoded value for 'None'
        if side_effects != 'None':
            side_effects_encoded = encoders['side_effects'].transform([side_effects])[0]

        health_conditions = request.form.get('health_conditions', 'None')  # Default to 'None' if not provided
        if health_conditions == '':
            health_conditions = 'None'  # Treat empty string as 'None'
        health_conditions_encoded = 0  # Default encoded value for 'None'
        if health_conditions != 'None':
            health_conditions_encoded = encoders['health_conditions'].transform([health_conditions])[0]

        # Ensure the input array always has 5 features
        input_features = np.array([[age, gender_encoded, preferences_encoded, side_effects_encoded, health_conditions_encoded]])

        # Get the model's probability scores for all classes (meals)
        probabilities = model.predict_proba(input_features)[0]

        # Find the top 3 meals based on probabilities
        top_indices = np.argsort(probabilities)[-3:][::-1]  # Indices of top 3 meals
        top_meals = [encoders['meal'].inverse_transform([idx])[0] for idx in top_indices]

        # Render results in the HTML template
        return render_template('dietResults.html', meals=top_meals)

    except Exception as e:
        return jsonify({'error': str(e)})


       

if __name__ == "__main__":
    app.run(debug=True)