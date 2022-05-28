from flask import Flask, render_template, url_for,request, redirect, session
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime, random, time, flask
import math, random, base64, smtplib
from datetime import date
from SageQuestion import Quiz
from flask_sqlalchemy import SQLAlchemy
from turtle import Turtle, Screen
from paddle import Paddle
from ball import Ball
from brick import Brick
from point import Point
from urllib.request import urlopen


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
    return point.point

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

@app.route("/",methods=['GET', "POST"])
def index():
    session['role'] = None
    session['Username'] = None
    return render_template("index.html")

@app.route("/results",methods=['GET', "POST"])
def results():
    return render_template("results.html")

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
            session['role']=detail['role']
            if(session['role'] == "User"):
                session['score'] = "0"
                return redirect('/image')
            else:
                return redirect('/takecare')
        else:
            return "Incorrect Credentials!"

    return render_template("Login.html")

@app.route('/signup',methods=['GET','POST'])
def signup():
    if(request.method=="POST"):
        name= request.form.get("name")
        email=request.form.get("email")
        role=request.form.get("role")
        passw=request.form.get("pass")
        cpass=request.form.get("cpass")
        if(passw==cpass):
            x=collog.insert_one({"name": name, "email": email, "role": role, "pass": passw, "photo": []})
        if(x):
            return render_template("login.html")
    return render_template("signup.html")

@app.route("/logout",methods=['GET','POST'])
def logout():
    session['role']=None
    return redirect('/')

@app.route("/image",methods=['GET', "POST"])
def image():
    if(session['Username']):
        word_site = "https://www.mit.edu/~ecprice/wordlist.10000"
        response = urlopen(word_site)
        txt = response.read()
        WORDS = txt.splitlines()
        word1 = (random.choice(WORDS).decode('utf-8'))
        word2 = (random.choice(WORDS).decode('utf-8'))
        session['w1'] = word1
        session['w2'] = word2

        if(request.method=="POST"):
            check = "No, That's Incorrect!"
            name = request.form.get("name")
            hidd = request.form.get("hidd")
            print(name, hidd)
            if(hidd.lower() == name.lower()):
                check = "That's correct!!"
                session['score'] = str(int(session['score']) + 5)
            #return render_template("image.html", check = check, name = hidd)
            return redirect('/clock')

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
        return render_template("image.html", name=cur[2], check = "null", w1 = word1, w2 = word2)
    else:
        return redirect('/login')

@app.route('/sage',methods=['GET','POST'])
def selftest():
    if(session['Username']):
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
            #return str(TotalQuestion)
            session['sage'] = str(TotalQuestion)
            return redirect("/brick")
    else:
        return redirect('/login')


@app.route('/clock',methods=['POST','GET'])
def clock():
    if(session['Username']):
        if(request.method == "POST"):
            ans = request.form.get("ans")
            if(ans == 1):
                session['score'] = str(int(session['score']) + 5)

        #return render_template("clock.html")
        return redirect('/Animal')
    else:
        return redirect('/login')

@app.route('/Animal',methods=['POST','GET'])
def Animal():
    if(session['Username']):
        if (request.method == "POST"):
            txt = open("Ani.txt", "r")
            AllAnimal = txt.readlines()
            for i in range(0, len(AllAnimal)):
                AllAnimal[i] = AllAnimal[i].replace("\n", "").lower()
            d1 = request.form.get("Q1")
            d2 = request.form.get("Q2")
            d3 = request.form.get("Q3")
            d4 = request.form.get("Q4")
            d5 = request.form.get("Q5")
            mylist = [d1,d2,d3,d4,d5]
            print(mylist)
            if(len(mylist) == 5):
                i = 0
                for animal in mylist:
                    if(animal in AllAnimal):
                        i = i + 1
                session['score'] = str(int(session['score']) + i)
                if(i == 5):
                    #return "Correct Answer"
                    return redirect('/sage')

                else:
                    #return "Wrong Answer"
                    return redirect('/sage')
            else:
                #return "No Duplicate"
                return redirect('/sage')

        return render_template("Animal.html")
    else:
        return redirect('/login')

@app.route('/brick',methods=['GET','POST'])
def brick():
    if(session['Username']):
        try:
            s = runapp()
            session['score'] = str(int(session['score']) + s)
        except:
            print("")

        #return redirect(f"/forum/{pg}")
        return redirect('sudoku')
    else:
        return redirect('/login')

@app.route('/sudoku',methods=['GET','POST'])
def sudoku():
    if(session['Username']):
        return render_template("sudoku.html")
    else:
        return redirect('/login')

@app.route('/photorecall', methods=['Get','POST'])
def photorecall():
    uname = session['Username']
    detail = collog.find_one({"email": uname})["photo"]
    print(detail)
    return render_template("photorecall.html")

def getAllUsers():
    queries = collog.find()
    list=[]
    for i in queries:
        lis=[]

        try:
            lis.append(i['_id'])
            lis.append(i['email'])
            lis.append(i['name'])

            if(i.get("takecare")== None):
                pass
            else:
                lis.append(i['takecare'])

            list.append(lis)
        except:
            pass

    print(list)
    return list

@app.route('/takecare',methods=['GET','POST'])
def Takecare():
    Users = getAllUsers()
    return flask.render_template("careTakerAll.html",Users = Users)


@app.route('/PersonalTakeCare/<id>',methods=['GET','POST'])
def personalTakecare(id):

    Id = id
    objInstance = ObjectId(id)
    patient = collog.find_one({"_id": objInstance})

    if(patient.get('takecare') == None):
        return flask.render_template("personalCareTaker.html",patient = patient)
    else:
        print(patient)
        return flask.render_template("personalView.html",id = patient['_id'] ,name = patient['name'],patient = patient['takecare'])

@app.route('/submitPatient/<id>',methods=['GET','POST'])
def SUBMIT(id):

    dit = {"M":{
        "Medications":request.form.get("MM"),
        "Dosage":request.form.get("MD"),
        "Time":request.form.get("MT")
    },"A":{
        "Medications":request.form.get("AM"),
        "Dosage": request.form.get("AD"),
        "Time":request.form.get("AT")
    },"N":{
        "Medications":request.form.get("NM"),
        "Dosage": request.form.get("ND"),
        "Time":request.form.get("NT")
    }
    }
    Id = id
    objInstance = ObjectId(id)
    collog.update_one({"_id": objInstance},{"$set" : {"takecare":dit}})

    patient = collog.find_one({"_id": objInstance})
    return flask.render_template("personalView.html",id = patient['_id'], name=patient['name'], patient=patient['takecare'])

@app.route('/final',methods=['GET','POST'])
def final():
    return render_template("final.html")

if __name__ == "__main__":
    app.run()
