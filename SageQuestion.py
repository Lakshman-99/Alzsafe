class Quiz:
    questions=[]
    def __init__(self):
        self.questions=\
        [
            {"name":"question1","Q":"Have you had any problems with memory or thinking?"}
            , {"name":"question2","Q":"Have you had any blood relatives that have had problems with memory or thinking?"}
            , {"name":"question3","Q":"Do you have balance problems?"}
            , {"name":"question4","Q":"If yes, do you know the cause? "}
            , {"name":"question5","Q":"Have you ever had a major stroke?"}
            , {"name":"question6","Q":"A minor or mini-stroke? "}
            , {"name":"question7","Q":"Do you currently feel sad or depressed?  "}
            , {"name":"question8","Q":"Have you had any change in your personality?"}
            , {"name": "question9", "Q": "Do you have more difficulties doing everyday activities due to thinking problems?"}
         ]

    def getQuestions(self):
        return self.questions

    def checkanswer(self,answers):
        return answers
