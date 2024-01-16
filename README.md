# QiaoQiao
Chinese Character and Words Learning Web App [Web App Available for Use Here](https://www.qiaoqiao.online)<br> 

Access organized vocabulary tables, mark learned entries, and delve into a comprehensive Character/Word analysis section, featuring example sentences, definitions, word decomposition, stroke order, and related words.

### Made with React, Springboot, Django, served with Nginx, authentication and storage by Firebase 

## Site Preview
1. Home page, where definitions can be looked up and tables are linked.
![welcome-page.png](assets%2Fwelcome-page.png)

2. Table page(s), where word entries can be learned 
![table-view-page.png](assets%2Ftable-view-page.png)

## Building and Serving the App
### Requirements
1. docker and docker-compose 

### Steps (for development)
1. run "docker-compose -f docker-compose-dev.yml up" 
- access front end at local port 3000, spring boot api at 8080, and django api at port 8000
- add "-d" parameter after up for headless
- this starts a live/hot reload instance of react where
changes can be seen as front end code is modified. 
- to see changes when modifying backend Springboot or Django
run "docker-compose restart" (if not in headless do "docker-compose down" first)

### Steps (for production) 
1. run "docker-compose -f docker-compose.yml build --no-cache"
2. run "docker-compose -f docker-compose.yml up"
- front end will be at port 80, spring boot api at 8080, django api at 8000.

## [WARNING] SSL KEY AND CRT MUST BE PRESENT FOR PRODUCTION ENV TO RUN
* add ssl key and crt in ssl folder 

## FIREBASE USAGE
1. Firebase Authentication for google sign in 
   1. Firebase config environment should be changed in frontend/src/service/firebase.js
2. Firebase storage to store users learned words. 
   1. Document structure must have a collection /Users 

## How to add new vocabulary table? 
1. Make csv file tha follows this pattern
   1. Table Title Goes on the First Line
   2. ALl rows after should have 5 columns seperated by commas in the following order <br>
      * word index, simplified text, traditional text, pinyin, definition 
2. Add the csv file to backend/.../services/data
3. Add path to csv file to backend/.../services/table_paths.txt 
4. Restart the container and new table show on the front end. 
    - Whenever a user logins or creates an account the table will automatically be added to their firebase document.

