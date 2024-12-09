import os

from mistralai import Mistral
from mistralai.models import UserMessage

#code needs to run before website is loaded

class AI():
    #Salvador's api key needed for acesses to model (key expires 1 month past due date)
    api_key = os.environ["Cwtkhm0a8EX1Hn8nqflLue8NqqTy329m"]
    #model of AI (this is a free tier model)
    model = "pixtral-12b-2409"
    client = Mistral(api_key=api_key)

    #input the title of the movie to be reviewd
    def __init__(self, title):
        self.title = title

    def ai_reviews(self):
        #Question to ask the AI
        question = 'What do reviews think of',self.title, '? reply with "no results" if no valid reviews exists'

        #AI responcds
        chat_response = self.client.chat.complete(model=self.model, messages=[UserMessage(content=question)])

        # AI returns result
        return chat_response.choices[0].message.content
    

    
#How to set up quickly setup Mistrail AI

#in cmd
#	setx MISTRAL_API_KEY "Cwtkhm0a8EX1Hn8nqflLue8NqqTy329m"

#	pip install mistralai

#to run a file in vscode terminal
#	python [file path]