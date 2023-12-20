@echo off
%~dp0
cls

pm2 start bot-grid.js -i 1 --name "GridBot" -c "0 */2 * * *" --max-restarts 500 && pm2 save && pm2 monit

pause