from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine, Base
from models import User, UploadedFile
import os
import pandas as pd
import json
import pandas as pd
from fastapi import HTTPException


# --------------------- DB SETUP ---------------------
Base.metadata.create_all(bind=engine)

app = FastAPI()

# --------------------- CORS ---------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------- DB Dependency ---------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --------------------- Pydantic Schemas ---------------------
class RegisterRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str


# --------------------- REGISTER ---------------------
@app.post("/register")
def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(username=request.username, password=request.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


# --------------------- LOGIN ---------------------
@app.post("/login")
def login_user(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == request.username,
        User.password == request.password
    ).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "username": user.username}


# --------------------- UPLOAD FILE ---------------------
@app.post("/upload")
async def upload_file(username: str, file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Upload a CSV or Excel file, save to disk, and store a small preview in DB.
    """
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    upload_dir = "uploaded_files"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        # Read CSV or Excel
        if file.filename.lower().endswith(".csv") or file.content_type == "text/csv":
            try:
                df = pd.read_csv(file_path, encoding="utf-8")
            except UnicodeDecodeError:
                df = pd.read_csv(file_path, encoding="latin1")
        elif file.filename.lower().endswith((".xls", ".xlsx")) or "excel" in file.content_type:
            df = pd.read_excel(file_path, engine="openpyxl")
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type: {file.content_type}. Only .csv or .xlsx allowed."
            )

        # Store preview (first 5 rows)
        df_head = df.head().to_json(orient="records")

        new_upload = UploadedFile(
            file_name=file.filename,
            data=df_head,
            owner_id=user.id
        )
        db.add(new_upload)
        db.commit()
        db.refresh(new_upload)

        return {"message": "File uploaded successfully", "file": file.filename}

    except Exception as e:
        print("Upload Error:", e)
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


# --------------------- FETCH USER REPORTS ---------------------
@app.get("/reports")
def get_reports(username: str, db: Session = Depends(get_db)):
    """
    Get uploaded files by username
    """
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    uploads = db.query(UploadedFile).filter(UploadedFile.owner_id == user.id).all()
    return [
        {
            "id": u.id,
            "file_name": u.file_name,
            "uploaded_at": u.uploaded_at,
            "data": u.data
        }
        for u in uploads
    ]

# --------------------- VIEW REPORT AS CHART ---------------------

@app.get("/report/{id}/view")
def view_report_chart(id: int, db: Session = Depends(get_db)):
    file = db.query(UploadedFile).filter(UploadedFile.id == id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        records = json.loads(file.data)
        if not records:
            raise HTTPException(status_code=400, detail="No data")

        df = pd.DataFrame(records)

        # 🔑 FORCE X-axis (first column) → STRING ONLY
        x_col = df.columns[0]
        df[x_col] = df[x_col].astype(str)

        # 🔑 FORCE Y-axis → NUMBERS ONLY
        for col in df.columns[1:]:
            df[col] = pd.to_numeric(df[col], errors="coerce")

        # remove bad rows
        df = df.dropna()

        return {
            "columns": df.columns.tolist(),
            "data": df.values.tolist()
        }

    except Exception as e:
        print("Chart error:", e)
        raise HTTPException(status_code=500, detail="Chart data error")


# --------------------- GET SINGLE FILE DATA ---------------------
@app.get("/report/{file_id}")
def get_report(file_id: int, db: Session = Depends(get_db)):
    """
    Return stored JSON data for one uploaded file
    """
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return {"file_name": file.file_name, "data": eval(file.data)}


# --------------------- DELETE FILE ---------------------
@app.delete("/report/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(UploadedFile).filter(UploadedFile.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = os.path.join("uploaded_files", file.file_name)
    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(file)
    db.commit()
    return {"message": "File deleted successfully!"}
