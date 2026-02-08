from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Dummy credentials
USER_CREDENTIALS = {
    "admin": "password123"
}

@app.route("/")
def home():
    # Show login page first
    return render_template("login.html")

@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]

    if username in USER_CREDENTIALS and USER_CREDENTIALS[username] == password:
        # Login successful → show index.html
        return render_template("index.html")
    else:
        # Login failed → show login page with error
        return render_template("login.html", error="Invalid username or password")

if __name__ == "__main__":
    app.run(debug=True)