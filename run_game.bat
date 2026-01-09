@echo off
title Horror Game Launcher
color 4F

echo.
echo  ================================
echo  SYSTEM ALERT - HORROR GAME
echo  ================================
echo.
echo  Choose version:
echo  1. Basic Horror Game
echo  2. Advanced Horror Game (recommended)
echo.

set /p choice="Enter your choice (1-2): "

if "%choice%"=="1" (
    python horror_game.py
) else if "%choice%"=="2" (
    python horror_game_advanced.py
) else (
    echo Invalid choice!
    pause
)
