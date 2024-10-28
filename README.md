# Verity: Misinformation Detection Extension

Verity is a browser extension that helps users identify misleading content on social media platforms. The system detects four types of deceptive content:

- Deepfake Images
- Social Media Bots
- Political Misinformation
- Clickbait Content

##  How to Stup

### Pre-requisites
- Python 3.10.7
- VS Code

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/hirushinidem/Verity-Extension.git
    ```
2. Navigate to the project directory:
    ```bash
    cd Verity-Extension/verity-api
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
![image](https://github.com/user-attachments/assets/bda67693-cd65-4be7-b43f-dba101cc1422)


