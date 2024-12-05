from flask import Flask,render_template

app = Flask(__name__)

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

@app.route('/Login')
def Login():
    return render_template("login_donar.html")

@app.route('/Register')
def Register():
    return render_template("registration_donar.html")   

if __name__ == "__main__":
    app.run(debug=True)