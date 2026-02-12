from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

DATABASE_URL = "sqlite:///./workflow.db"

# Create SQLite engine
engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False}  # Required for SQLite
)


# Create all tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


# Dependency to get DB session
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
