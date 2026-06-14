from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
import serial
import psutil
import time
import cv2
import threading
from ultralytics import YOLO

# =========================
# INIT
# =========================

app = FastAPI()

time.sleep(2)  # small boot delay (remove your 300s sleep)
model = YOLO("./yolo26n.pt")

SERIAL_PORT = "/dev/ttyUSB0"
BAUDRATE = 115200

# =========================
# SERIAL
# =========================

try:
    ser = serial.Serial(SERIAL_PORT, BAUDRATE, timeout=1)
except Exception as e:
    ser = None
    print(f"[SERIAL ERROR] {e}")

# =========================
# SYSTEM INFO
# =========================

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
    return f"{minutes} minutes"


def get_cpu_temp():
    try:
        temps = psutil.sensors_temperatures()
        for entries in temps.values():
            if entries:
                return entries[0].current
    except:
        pass
    return 0

# =========================
# SERIAL HELPERS
# =========================

def write_serial(cmd: str):
    if ser is None or not ser.is_open:
        raise HTTPException(status_code=500, detail="Serial not connected")
    ser.write(cmd.encode())
    ser.flush()

# =========================
# API CONTROL
# =========================

@app.post("/api/right")
def right():
    write_serial("a")
    return {"success": True}

@app.post("/api/left")
def left():
    write_serial("d")
    return {"success": True}

@app.post("/api/up")
def up():
    write_serial("e")
    return {"success": True}

@app.post("/api/down")
def down():
    write_serial("q")
    return {"success": True}

@app.post("/api/stop")
def stop():
    write_serial("w")
    write_serial("s")
    return {"success": True}

@app.post("/api/gear")
def gear():
    write_serial("t")
    return {"success": True}

# =========================
# STATUS
# =========================

@app.get("/api/stat")
def status():
    return {
        "status": "online",
        "temp": get_cpu_temp(),
        "cpu": psutil.cpu_percent(interval=0.1),
        "mem": psutil.virtual_memory().percent,
        "uptime": get_uptime()
    }

# =========================
# CAMERA SYSTEM
# =========================

camera = None
latest_frame = None
yolo_frame = None
yolo_result = None

lock = threading.Lock()

FPS = 15
FRAME_TIME = 1.0 / FPS

useai = False


def open_camera(index: int):
    global camera

    if camera is not None:
        try:
            camera.release()
        except:
            pass

    cam = cv2.VideoCapture(index, cv2.CAP_V4L2)

    if not cam.isOpened():
        print(f"[ERROR] Cannot open camera {index}")
        camera = None
        return False

    camera = cam
    print(f"[OK] Camera opened {index}")
    return True


def capture_loop():
    global latest_frame

    while True:
        if camera is None:
            time.sleep(1)
            continue

        start = time.time()

        try:
            ret, frame = camera.read()

            if ret and frame is not None:
                with lock:
                    latest_frame = frame.copy()
        except Exception as e:
            print("[CAPTURE ERROR]", e)

        time.sleep(max(0, FRAME_TIME - (time.time() - start)))


def yolo_loop():
    global yolo_frame, yolo_result

    while True:
        if not useai:
            time.sleep(0.2)
            continue

        with lock:
            if latest_frame is None:
                time.sleep(0.1)
                continue
            frame = latest_frame.copy()

        try:
            results = model(frame, verbose=False)[0]
            annotated = results.plot()

            detections = [
                {
                    "class": model.names[int(b.cls[0])],
                    "confidence": round(float(b.conf[0]), 3)
                }
                for b in results.boxes
            ]

            with lock:
                yolo_frame = annotated
                yolo_result = detections

        except Exception as e:
            print("[YOLO ERROR]", e)
            time.sleep(0.2)

# =========================
# STARTUP
# =========================

@app.on_event("startup")
def startup():
    open_camera(0)

    threading.Thread(target=capture_loop, daemon=True).start()
    threading.Thread(target=yolo_loop, daemon=True).start()

# =========================
# CAMERA API
# =========================

@app.get("/api/cam")
def cam():
    with lock:
        if latest_frame is None:
            return {"error": "no frame"}

        _, buf = cv2.imencode(".jpg", latest_frame)
        return Response(buf.tobytes(), media_type="image/jpeg")


@app.get("/api/aicam")
def aicam():
    with lock:
        if yolo_frame is None:
            return {"error": "no ai frame"}

        _, buf = cv2.imencode(".jpg", yolo_frame)
        return Response(buf.tobytes(), media_type="image/jpeg")


@app.get("/api/aidetect")
def aidetect():
    with lock:
        return yolo_result or []

# =========================
# AI CONTROL
# =========================

@app.get("/api/disableai")
def toggle_ai():
    global useai
    useai = not useai
    return {"useai": useai}

# =========================
# CAMERA SWITCH
# =========================

@app.get("/api/change")
def change_camera(id: int):
    ok = open_camera(id)
    if not ok:
        raise HTTPException(status_code=400, detail="camera not available")
    return {"camera": id}
