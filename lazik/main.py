from fastapi import FastAPI, HTTPException
import serial
import psutil
import time
from datetime import datetime

app = FastAPI()

SERIAL_PORT = "/dev/ttyUSB0"
BAUDRATE = 115200

try:
    ser = serial.Serial(
        port=SERIAL_PORT,
        baudrate=BAUDRATE,
        timeout=1
    )
except Exception as e:
    ser = None
    print(f"Failed to open serial port: {e}")

def get_uptime():
    boot_time = psutil.boot_time()
    seconds = int(time.time() - boot_time)

    days = seconds // 86400
    hours = (seconds % 86400) // 3600
    minutes = (seconds % 3600) // 60

    if days > 0:
        return f"{days} days {hours} hours"
    elif hours > 0:
        return f"{hours} hours {minutes} minutes"
    else:
        return f"{minutes} minutes"


def get_cpu_temp():
    try:
        temps = psutil.sensors_temperatures()
        if not temps:
            return None

        # common keys: coretemp, cpu_thermal, etc.
        for name, entries in temps.items():
            if entries:
                return entries[0].current

        return None
    except Exception:
        return None

@app.post("/api/right")
def right():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("a".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.post("/api/left")
def left():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("d".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.post("/api/up")
def up():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("a".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.post("/api/down")
def down():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("d".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.post("/api/stop")
def stop():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("w".encode("utf-8"))
    ser.flush()
    ser.write("s".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.post("/api/gear")
def gear():    
    if ser is None or not ser.is_open:
        raise HTTPException(
            status_code=500,
            detail="Serial port not connected"
        )
    ser.write("t".encode("utf-8"))
    ser.flush()

    return {
        "success": True
    }

@app.get("/api/stat")
def status():
    cpu = psutil.cpu_percent(interval=0.1)
    mem = psutil.virtual_memory().percent
    temp = get_cpu_temp()
    if temp == None:
        temp = 0
    uptime = get_uptime()

    return {
        "status": "online",
        "temp": temp,
        "cpu": cpu,
        "mem": mem,
        "uptime": uptime
    }
