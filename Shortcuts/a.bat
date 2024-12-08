@echo off

REM Prompt the user for input
echo Would you like to pull the latest changes? (y for Yes, n for No)
set /p userInput=Enter your choice (y/n): 

REM Validate input
if /i "%userInput%"=="y" (
    echo Pulling latest changes...
    cd /d D:\cms
    git pull
) else if /i "%userInput%"=="n" (
    echo Skipping pull...
) else (
    echo Invalid input. Please enter y or n.
    pause
    exit /b 1
)

REM Check if the CMS directory exists
if not exist "D:\cms" (
    echo Error: The CMS directory does not exist.
    exit /b 1
)

REM Start the CMS process in a new terminal with a specific title
echo Starting CMS...
if "%userInput%" =="y" (
start "CMS" cmd /k "cd /d D:\cms && npm i && npm run dev"
)  else (
start "CMS" cmd /k "cd /d D:\cms && npm run dev"
)

REM Check if the server directory exists
if not exist "D:\cms\server" (
    echo Error: The server directory does not exist.
    exit /b 1
)

REM Start the CMS Server in a new terminal with a specific title
echo Starting CMS Server...
if "%userInput%" =="y" (
start "CMS Server" cmd /k "cd /d D:\cms\server && npm i && nodemon app.js"
)  else (
start "CMS Server" cmd /k "cd /d D:\cms\server && nodemon app.js"
)

REM Check if the server directory exists
if not exist "D:\cms\server" (
    echo Error: The server directory does not exist.
    exit /b 1
)

REM Start the CMS build Server in a new terminal with a specific title
echo Starting CMS build server...
if "%userInput%" =="y" (
start "CMS build server" cmd /k "cd /d D:\cms\build-server && npm i && nodemon app.js"
)  else (
start "CMS build server" cmd /k "cd /d D:\cms\build-server && nodemon app.js"
)

REM Start the CMS notification Server in a new terminal with a specific title
echo Starting CMS notification server...
if "%userInput%" =="y" (
start "CMS notification server" cmd /k "cd /d D:\cms\notification-server && npm i && nodemon app.js"
)  else (
start "CMS notification server" cmd /k "cd /d D:\cms\notification-server && nodemon app.js"
)

REM Notify success
echo CMS and Server processes have been started successfully.

REM Wait for user to press Enter
echo Press Enter to stop all servers and close terminals...
pause > nul

REM Close all related processes and terminals
echo Stopping all servers and closing terminals...

REM Kill the Node.js processes
taskkill /f /im node.exe >nul 2>&1

REM Close CMD windows for CMS and CMS Server based on their titles
taskkill /f /fi "WINDOWTITLE eq CMS" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq CMS Server" >nul 2>&1

REM Notify success
echo All servers and terminal windows have been closed.
exit