import os
from dotenv import load_dotenv

# Load .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/omnicivilization")
    API_TITLE: str = os.getenv("API_TITLE", "OmniCivilization Analytics API")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

settings = Settings()
