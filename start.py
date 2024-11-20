# start.py

import subprocess
import os
import sys
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.11 or higher."""
    required_version = (3, 11)
    current_version = sys.version_info[:2]
    
    if current_version < required_version:
        print(f"Python {required_version[0]}.{required_version[1]} or higher is required")
        sys.exit(1)

def setup_environment():
    """Setup virtual environment and install dependencies."""
    venv_path = Path("venv")
    
    if not venv_path.exists():
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", "venv"])
    
    # Determine the pip path based on OS
    pip_path = "venv/bin/pip" if os.name != 'nt' else r"venv\Scripts\pip"
    
    print("Installing dependencies...")
    subprocess.run([pip_path, "install", "-r", "backend/requirements.txt"])

def create_env_file():
    """Create .env file if it doesn't exist."""
    env_path = Path(".env")
    
    if not env_path.exists():
        print("Creating .env file...")
        with open(env_path, "w") as f:
            f.write("""MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=mindfulconnect
JWT_SECRET_KEY=your-super-secret-key-here
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-api-key
""")
        print("Created .env file - please update with your configurations")

def main():
    """Main startup function."""
    print("Starting MindfulConnect setup...")
    
    check_python_version()
    setup_environment()
    create_env_file()
    
    print("\nSetup complete! Start the application with:")
    print("source venv/bin/activate  # On Unix/MacOS")
    print("venv\\Scripts\\activate    # On Windows")
    print("uvicorn backend.app.main:app --reload")

if __name__ == "__main__":
    main()