@echo off
if not "%~1"=="--dans-terminal" (
  where wt >nul 2>nul && (
    start "" wt -w new --title "ESGI Entrainement" --suppressApplicationTitle -d "%~dp0." cmd /c "%~nx0" --dans-terminal
    exit /b
  )
)
chcp 65001 > nul
title ESGI Entrainement
cd /d "%~dp0.."
echo ESGI Entrainement : le site s'ouvre dans le navigateur.
echo Fermer cette fenetre pour l'arreter.
echo.
call npm start
echo.
echo Le site s'est arrete.
pause
