@echo off
setlocal EnableExtensions

rem Always run from the folder containing this file, even when it has spaces.
pushd "%~dp0"
if errorlevel 1 (
    echo.
    echo [ERROR] Could not open the project folder.
    pause
    exit /b 1
)

set "VENV_DIR=%CD%\.venv"
set "VENV_PYTHON=%VENV_DIR%\Scripts\python.exe"
set "BACKEND_URL=http://127.0.0.1:8000"
set "SERVER_URL=http://127.0.0.1:3000"
set "REQUIREMENTS=%CD%\Requirements.txt"
set "PACKAGE_JSON=%CD%\package.json"

echo.
echo  MULTIVERSE PRO
echo  ----------------
echo  Preparing the local Python environment...
echo.

where py >nul 2>&1
if not errorlevel 1 (
    rem Prefer normal CPython over the optional free-threaded 3.13 build.
    py -3.13 -c "import sys" >nul 2>&1
    if not errorlevel 1 (
        set "PYTHON=py -3.13"
    ) else (
        py -3.12 -c "import sys" >nul 2>&1
        if not errorlevel 1 (
            set "PYTHON=py -3.12"
        ) else (
            py -3.11 -c "import sys" >nul 2>&1
            if not errorlevel 1 (set "PYTHON=py -3.11") else (set "PYTHON=python")
        )
    )
) else (
    where python >nul 2>&1
    if errorlevel 1 goto :python_missing
    set "PYTHON=python"
)

if not exist "%REQUIREMENTS%" goto :requirements_missing
if not exist "%PACKAGE_JSON%" goto :frontend_missing

if exist "%VENV_PYTHON%" (
    "%VENV_PYTHON%" -c "import sys; raise SystemExit(0 if getattr(sys, '_is_gil_enabled', lambda: True)() else 1)" >nul 2>&1
    if errorlevel 1 (
        echo Existing environment uses free-threaded Python; recreating it with standard CPython...
        %PYTHON% -m venv --clear "%VENV_DIR%"
        if errorlevel 1 goto :venv_failed
    ) else (
        echo [1/3] Existing virtual environment found.
    )
) else (
    echo [1/3] Creating the private virtual environment...
    %PYTHON% -m venv "%VENV_DIR%"
    if errorlevel 1 goto :venv_failed
)

echo [2/3] Installing Python dependencies...
"%VENV_PYTHON%" -m pip install -r "%REQUIREMENTS%"
if errorlevel 1 goto :pip_failed

echo [3/3] Starting the FastAPI server...
start "MULTIVERSE PRO SERVER" /b cmd /c ""%VENV_PYTHON%" -m uvicorn Server:app --host 127.0.0.1 --port 8000"

echo Waiting for the backend to become ready...
set "READY="
for /l %%N in (1,1,30) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%BACKEND_URL%/api/' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 (
        set "READY=1"
        goto :backend_ready
    )
    timeout /t 1 /nobreak >nul
)

echo.
echo [ERROR] The server did not become ready within 30 seconds.
echo Check the server window above for the Python error, then try START.bat again.
pause
popd
exit /b 1

:backend_ready
where npm >nul 2>&1
if errorlevel 1 (
    if exist "%ProgramFiles%\nodejs\npm.cmd" (
        set "PATH=%ProgramFiles%\nodejs;%PATH%"
    ) else (
        goto :node_missing
    )
)

echo Installing frontend dependencies if needed...
call npm install --legacy-peer-deps
if errorlevel 1 goto :npm_failed

echo Starting the MULTIVERSE PRO interface...
start "MULTIVERSE PRO UI" /b cmd /c "set PORT=3000&& npm start"

echo Waiting for the browser interface to become ready...
set "READY="
for /l %%N in (1,1,60) do (
    powershell -NoProfile -ExecutionPolicy Bypass -Command "try { $r = Invoke-WebRequest -UseBasicParsing -Uri '%SERVER_URL%' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
    if not errorlevel 1 (
        set "READY=1"
        goto :frontend_ready
    )
    timeout /t 1 /nobreak >nul
)

echo.
echo [ERROR] The React interface did not become ready within 60 seconds.
echo Check the UI window above for the Node.js error, then try START.bat again.
pause
popd
exit /b 1

:frontend_ready
echo.
echo MULTIVERSE PRO is ready.
echo Opening %SERVER_URL%
start "" "%SERVER_URL%"
echo.
echo Keep this window and the server/UI windows open while using the application.
echo Close them to stop MULTIVERSE PRO.
echo.
cmd /k
popd
exit /b 0

:python_missing
echo.
echo [ERROR] Python 3 was not found.
echo Install Python 3.10 or newer from https://www.python.org/downloads/
echo During installation, enable "Add python.exe to PATH", then run START.bat again.
pause
popd
exit /b 1

:requirements_missing
echo.
echo [ERROR] Requirements.txt is missing from the project folder.
echo Re-download the complete project and make sure START.bat is beside Requirements.txt.
pause
popd
exit /b 1

:frontend_missing
echo.
echo [ERROR] package.json is missing from the project folder.
echo Re-download the complete project and make sure the React files are included.
pause
popd
exit /b 1

:node_missing
echo.
echo [ERROR] Node.js/npm was not found.
echo Install Node.js LTS from https://nodejs.org/, then run START.bat again.
pause
popd
exit /b 1

:npm_failed
echo.
echo [ERROR] React dependencies could not be installed.
echo Check your internet connection and the npm error above.
pause
popd
exit /b 1

:venv_failed
echo.
echo [ERROR] Python could not create the private .venv folder.
echo Check that you have write permission for this project folder.
pause
popd
exit /b 1

:pip_failed
echo.
echo [ERROR] Python dependencies could not be installed.
echo Check your internet connection and that Python was installed with pip.
pause
popd
exit /b 1
