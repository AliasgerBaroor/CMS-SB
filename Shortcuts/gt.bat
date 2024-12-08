@echo off
REM Check if an argument is provided
if "%~1"=="" (
    echo Please provide a commit message as an argument.
    exit /b
)

REM Execute Git commands
git add .
git commit -m "%~1"
git push

echo Git commands executed successfully.
