from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)
    uploads = relationship("UploadedFile", back_populates="owner")


class UploadedFile(Base):
    __tablename__ = "uploads"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String)
    data = Column(Text)  # store small CSV/XLSX preview as text
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="uploads")
