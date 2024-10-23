# Project Verity

Project Verity is designed to detect fake images, clickbait, political misinformation, and bot activity.

## Table of Contents
1. Application (Extension)
2. API
3. How to Setup
4. Others

---

## 1. Application (Extension)
- **Use Technology**: Html, CSS, JavaScript
- **Application Folder (Drive or GitHub URL)**: [Extension Source Code](https://github.com/SilverlineIT/Project-Verity-Extension/tree/main/verity)
- **Application Folder Screenshot**:
    - Source Code

![Source Code](https://github.com/user-attachments/assets/a4650bf8-4bfe-4327-b41a-907f766a2324)
- **Screenshots for All Pages**
    - Home Page

![Screenshot 2024-09-20 155745](https://github.com/user-attachments/assets/1434fcb2-b94a-4e52-9485-6f9cd308ecbd)


## 2. API

- **Use Technology**: FastAPI
- **API Folder (Drive or GitHub URL)**: [API Source Code](https://github.com/SilverlineIT/Project-Verity-Extension/tree/main/verity-api)
- **API Folder Screenshot**: 
    - Source Code
  
   ![Screenshot 2024-09-20 160421](https://github.com/user-attachments/assets/f45acc7b-b389-415a-84c7-569f43b8909b)

- **API Testing Swagger Screenshots for All Endpoints**:
    - Fake Image Detection
![Screenshot 2024-09-20 161734](https://github.com/user-attachments/assets/fae43f93-3585-41bb-96b4-53de35d7b6ba)

    - Bot Detection
![Screenshot 2024-09-20 161821](https://github.com/user-attachments/assets/a036fb73-7701-40ba-8cdc-45865820c3ac)

    - Political Misinfo Detection
![Screenshot 2024-09-20 161909](https://github.com/user-attachments/assets/4da828ed-ef02-4d00-8275-6e08de086625)

    - Clickbait Detection
![Screenshot 2024-09-20 161940](https://github.com/user-attachments/assets/855c23ef-46b7-41f7-affb-ab229b9d089a)

---

## 3. How to Stup

### Pre-requisites
- Python 3.10.7
- VS Code

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/SilverlineIT/Project-Verity-Extension.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Project-Verity-Extension/verity-api
    ```
3. Install dependencies:
    ```bash
    spacy download en_core_web_sm
    pip install -r requirements.txt
    ```
4. Run the application:
    ```bash
    fastapi dev main.py
    ```


