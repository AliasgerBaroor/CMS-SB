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








@echo off

REM Parse input arguments
set "user=%~1"
set "projectShortName=%~2"

REM Validate arguments
if "%user%"=="" (
    echo Error: Missing user argument. Usage: bat_file user project
    exit /b 1
)

if "%projectShortName%"=="" (
    echo Error: Missing project short name argument. Usage: bat_file user project
    exit /b 1
)

REM Construct the project path
echo project name is "%projectShortName%"
if "%projectShortName%" == "c" (
    set "projectPath=D:\cms"
) else (
    set "projectPath=D:\cms\server"
)

REM Check if the project directory exists
if not exist "%projectPath%" (
    echo Error: The specified project directory does not exist: %projectPath%
    exit /b 1
)

REM Ask if the user wants to pull changes
echo Would you like to pull the latest changes for %projectShortName%? (y for Yes, n for No)
set /p userInput=Enter your choice (y/n): 

REM Validate input
if /i "%userInput%"=="y" (
    echo Pulling latest changes for %projectShortName%...
    cd /d "%projectPath%"
    git pull
) else if /i "%userInput%"=="n" (
    echo Skipping pull for %projectShortName%...
) else (
    echo Invalid input. Please enter y or n.
    pause
    exit /b 1
)

REM Start the CMS process in a new terminal with a specific title
echo Starting %projectShortName%...
start "%projectShortName% App" cmd /k "cd /d %projectPath% && npm i && npm run dev"

REM Check if the server directory exists
if not exist "%projectPath%\server" (
    echo Error: The server directory does not exist: %projectPath%\server
    exit /b 1
)

REM Start the CMS Server in a new terminal with a specific title
echo Starting %projectShortName% Server...
start "%projectShortName% Server" cmd /k "cd /d %projectPath%\server && npm i && nodemon app.js"

REM Notify success
echo %projectShortName% and Server processes have been started successfully.

REM Wait for user to press Enter
echo Press Enter to stop all servers and close terminals...
pause > nul

REM Close all related processes and terminals
echo Stopping all servers and closing terminals...

REM Kill the Node.js processes
taskkill /f /im node.exe >nul 2>&1

REM Close CMD windows for CMS App and CMS Server based on their titles
taskkill /f /fi "WINDOWTITLE eq %projectShortName% App" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq %projectShortName% Server" >nul 2>&1

REM Notify success
echo All servers and terminal windows have been closed.
exit






import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@/components/ui/breadcrumb"
        <BreadcrumbRoot mx={2} size="lg">
        {currentUrl.split('/').map((page_url, index, array) => {
          const excludeItem = [0, 1, 2, 3, 4];
          if (!excludeItem.includes(index)) {
            const partialUrl = array.slice(0, index + 1).join('/');

            return (
              <Box key={`${ index }-${ page_url }`}>
                {index === array.length - 1 ? (
                  <BreadcrumbCurrentLink>{ page_url }</BreadcrumbCurrentLink>
                ) : (
                  <BreadcrumbLink href={ partialUrl }>{ page_url }</BreadcrumbLink>
                )}
              </Box>
            );
          }
        })}


        </BreadcrumbRoot>
    