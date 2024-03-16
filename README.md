1) install Ract.js, Node.js, PosgreSQL
2) download the current project using git clone
3)  enter to the cd "client", writing a command "npm i'
4)  enter to the cd "server", writing a command "npm i'
5)  creating it .env in the root folder "client" (value: REACT_APP_API_URL=http://localhost:5000)
6)  creating it .env in the root folder "server" (value:
PORT=5000
DB_NAME=schedule
DB_USER= your user
DB_PASSWORD=your password
DB_HOST=localhost
DB_PORT=5432
JWT_ACCESS_SECRET=jwt-secret-key
JWT_REFRESH_SECRET=jwt-refresh-secret-key
API_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
7)open pgAdmin4 and create a new DB with name "schedule"
8)go to the cd "server" folder through the terminal and enter the command "npm start"
9)make sure that the tables are created in "pgAdmin"
10)create a second terminal, go to the "client" folder and enter the "npm start" command
