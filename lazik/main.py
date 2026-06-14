from fastapi import FastAPI, HTTPException, Response
import serial
import psutil
import time
from datetime import datetime
import cv2
import threading
from ultralytics import YOLO

model = YOLO("./yolo26n.pt")

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
    ser.write("e".encode("utf-8"))
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
    ser.write("q".encode("utf-8"))
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
camera1 = cv2.VideoCapture(0)
camera2 = camera1
for x in range(3):
    try: 
        c = cv2.VideoCapture(x+1)
        if(c.isOpened()):
            camera2 = c
    except:
        print("no cam"+(x+1))
camera = camera1

latest_frame = None
latest_frame_cpy = None
yolo_frame = None          # annotated frame or detection result
yolo_result = None         # optional: detections
lock = threading.Lock()
FPS = 15
FRAME_TIME = 1.0 / FPS
useai = False


def capture_loops():
    global latest_frame

    while True:
        start = time.time()

        ret, frame = camera.read()

        if ret:
            with lock:
                latest_frame = frame.copy()   # RAW FRAME ONLY

        elapsed = time.time() - start
        sleep_time = FRAME_TIME - elapsed

        if sleep_time > 0:
            time.sleep(sleep_time)

def yolo_loop():
    global yolo_frame, yolo_result

    while True:
        if not useai:
            time.sleep(0.1)
            continue
        with lock:
            if latest_frame is None:
                continue
            frame = latest_frame.copy()

        results = model(frame, verbose=False)
        result = results[0]

        annotated = result.plot()

        detections = []

        for box in result.boxes:
            cls_id = int(box.cls[0])
            conf = float(box.conf[0])

            detections.append({
                "class": model.names[cls_id],
                "confidence": round(conf, 3)
            })

        with lock:
            yolo_frame = annotated
            yolo_result = detections

        time.sleep(0.1)


@app.on_event("startup")
def start_camera_thread():
    thread = threading.Thread(target=capture_loops, daemon=True)
    thread.start()
    threading.Thread(target=yolo_loop, daemon=True).start()

@app.get("/api/cam")
def get_frame():
    with lock:
        if latest_frame is None:
            return {"error": "No frame available yet"}

        _, buffer = cv2.imencode(".jpg", latest_frame)

        return Response(
            content=buffer.tobytes(),
            media_type="image/jpeg"
        )

@app.get("/api/aicam")
def get_aiframe():
    with lock:
        if yolo_frame is None:
            return {"error": "No YOLO frame available yet"}

        _, buffer = cv2.imencode(".jpg", yolo_frame)

        return Response(
            content=buffer.tobytes(),
            media_type="image/jpeg"
        )

@app.get("/api/aidetect")
def get_aidetect():
    global yolo_result
    with lock:
        if yolo_result is None:
            return {"error": "No YOLO frame available yet"}
        return  yolo_result
        
@app.get("/api/disableai")
def get_disableai():
    global useai
    useai = useai == False

@app.get("/api/camswitch")
def get_camswitch():
    global camera
    global camera2
    global camera1
    if camera == camera1:
        camera = camera2
    else:
        camera = camera1
