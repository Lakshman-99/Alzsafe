from flask import Flask, render_template, url_for,request, redirect, session
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime
import math, random, base64, smtplib
from datetime import date
from SageQuestion import Quiz
from flask_sqlalchemy import SQLAlchemy
from turtle import Turtle, Screen
from paddle import Paddle
from ball import Ball
from brick import Brick
from point import Point
import random, time


app = Flask(__name__)
app.secret_key = 'Forum@2022'

app.config["MONGO_URI"] = "mongodb+srv://codesploit:codesploit@cluster0.xcehq.mongodb.net/test"
client = MongoClient("mongodb+srv://codesploit:codesploit@cluster0.xcehq.mongodb.net/test")
db = client['Alzsafe']
collog = db['Credentials']
colform = db['Forum']
colimg = db['Image']

def runapp():
    color=["red", "orange", "yellow", "green", "blue", "purple"]
    screen = Screen()
    ball = Ball()
    screen.tracer(0)
    screen.bgcolor("black")
    screen.setup()
    paddle = Paddle(0, -200)
    screen.listen()
    screen.onkey(paddle.Left,"Left")
    screen.onkey(paddle.Right,"Right")
    bricks=[]
    point=Point()
    y=300
    for j in range(4):
        x = -340
        for i in range(11):
            brick = Brick(random.choice(color))
            brick.goto(x,y)
            x=x+65
            bricks.append(brick)

        y=y-50

    gameon = True
    while gameon:
        screen.update()
        time.sleep(0.1)
        ball.move()
        if (ball.xcor()>340 or ball.xcor() < -340):
            ball.bounce_X()

        if (ball.ycor()>320):
            ball.bounce_Y()

        if(paddle.distance(ball)<30):
            ball.bounce_Y()

        if (ball.ycor() < -320):
            gameon=False
            point.gameover()

        for brick in bricks:
            if(ball.distance(brick)<30):
                brick.kill()
                point.addpoint()


    screen.exitonclick()

def getsize():
    queries = colform.find()
    list=[]
    for i in queries:
        lis=[]
        try:
            lis.append(i['Title'])
            lis.append(i['_id'])
            list.append(lis)
        except:
            pass
    print(list)
    return list


@app.route("/forumins",methods=['POST'])
def forumins():
    if(request.method=="POST"):
        title = request.form.get("title")
        comment = request.form.get("comment")
        print(title, comment)
        try:
            if(session['Username'] != None):
                colform.insert_one({"Name": session['Username'], "Title":title , "Body": comment, "Time": datetime.datetime.now(), "Threads":[] })
        except:
            return  render_template("forum.html", text="Please login to post")

    pg = session['page']
    return redirect(f"/forum/{pg}")

@app.route("/forum/<page>",methods=['GET', "POST"])
def forum(page):
    print(page)
    pageno = int(page[4:])
    queries = getsize()
    qsize = len(queries)
    session['page']=page
    if(pageno == 1):
        try:
            list = queries[:10]
        except:
            list = queries
    else:
        try:
            list = queries[10*(pageno-1)+1 : 10*pageno]
        except:
            list = queries[10*(pageno-1)+1 : ]
    print(pageno, list)
    return render_template("forum.html", detail=list, text="", pageno = math.ceil(float(qsize/10)), curno=pageno)

@app.route("/forum/queries/<id>",methods=['GET', "POST"])
def forumrep(id):
    query = colform.find_one({'_id': ObjectId(id)})
    list=[]
    list.append(query['Title'])
    list.append(query['Body'])
    print(list)
    return render_template("forumrep.html", query=list)

@app.route("/login",methods=['GET','POST'])
def login():
    if(request.method=="POST"):
        email = request.form.get("email")
        passw = request.form.get("pass")
        detail = collog.find_one({"email":email, "pass": passw})
        print(detail)
        if(detail != None):
            session['Username']=email
            return redirect('/forum/page1')
        else:
            return "Incorrect Credentials!"

    return render_template("Login.html")

@app.route('/signup',methods=['GET','POST'])
def signup():
    if(request.method=="POST"):
        name= request.form.get("name")
        email=request.form.get("email")
        passw=request.form.get("pass")
        cpass=request.form.get("cpass")
        if(passw==cpass):
            x=collog.insert_one({"name": name, "email": email, "pass": passw})
        if(x):
            return render_template("login.html")
    return render_template("signup.html")

@app.route("/image",methods=['GET', "POST"])
def image():
    if(request.method=="POST"):
        check = "No, That's Incorrect!"
        name = request.form.get("name")
        hidd = request.form.get("hidd")
        print(name, hidd)
        if(hidd.lower() == name.lower()):
            check = "That's correct!! "
        return render_template("image.html", check = check, name = hidd)

    vals = colimg.find()
    print(vals)
    val=[]
    for i in vals:
        val.append(i)

    cur = random.choice(val)
    cur=list(cur.values())
    imgdata = base64.b64decode(cur[1])
    filename = 'static/img.jpg'
    with open(filename, 'wb') as f:
        f.write(imgdata)
    return render_template("image.html", name=cur[2], check = "null")

@app.route('/sage',methods=['GET','POST'])
def selftest():
        if(request.method=="GET"):
            SAGE=Quiz()
            return render_template('sage.html',questions=SAGE.getQuestions())
        else:
            q="question"
            quiz = Quiz()
            answers=[]
            for i in range(1,len(quiz.getQuestions())+1):
                answers.append(request.form.get(q+str(i)))
            marks = quiz.checkanswer(answers)
            sum = ""
            print(marks)
            for x in range(len(marks)):
                sum = sum + marks[x] + " "

            TotalQuestion = quiz.getQuestions()
            Answer = sum.split(" ")
            i = 0
            for Question in TotalQuestion:
                Question['ans']  = Answer[i]
                i= i + 1
            return str(TotalQuestion)


@app.route('/getSage',methods=['POST','GET'])
def getSage():
    if (request.method == "GET"):
        return render_template("InputSage.html")

    else:
        today = date.today()
        d1 = today.strftime("%d-%m-%Y")
        d = {}

        if(d1 == request.form.get("date")):
            d["date"] = "YES"
        else:
            d["date"] = "No"
        d["Name"] = request.form.get("Name")
        d["DOB"] = request.form.get("DOB")
        d["school"] = request.form.get("school")
        d["gender"] = request.form.get("gender")
        d["Type"] = request.form.get("Type")
        print(d)

@app.route('/clock',methods=['POST','GET'])
def clock():
    return render_template("clock.html")

@app.route('/Animal',methods=['POST','GET'])
def Animal():
    if (request.method == "POST"):
        txt = open("Ani.txt", "r")
        AllAnimal = txt.readlines()
        for i in range(0, len(AllAnimal)):
            AllAnimal[i] = AllAnimal[i].replace("\n", "").lower()
        data = request.form.get("data")
        data = data.split(" ")
        data = [val.lower().strip() for val in data]
        mylist = data
        mylist = list(dict.fromkeys(mylist))
        print(mylist)
        if(len(mylist) == 5):
            i = 0
            for animal in mylist:
                if(animal in AllAnimal):
                    i = i + 1

            if(i == 5):
                # Add to the Database

                return "Correct Answer"

            else:
                return "Wrong Answer"
        else:
            return "No Duplicate"

    return render_template("Animal.html")

@app.route('/brick',methods=['GET','POST'])
def brick():
    try:
        runapp()
    except:
        print("")

    pg = session['page']
    return redirect(f"/forum/{pg}")

@app.route('/sudoku',methods=['GET','POST'])
def sudoku():
    return render_template("sudoku.html")

if __name__ == "__main__":
    app.run()
