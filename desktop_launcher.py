import threading
import time
from urllib.request import urlopen
import webbrowser

import uvicorn

from Server import app


SERVER_URL = "http://127.0.0.1:8000"


def open_browser_when_ready() -> None:
    for _ in range(60):
        try:
            with urlopen(SERVER_URL, timeout=1) as response:
                if response.status == 200:
                    webbrowser.open(SERVER_URL)
                    return
        except OSError:
            pass
        time.sleep(0.5)


if __name__ == "__main__":
    threading.Thread(target=open_browser_when_ready, daemon=True).start()
    uvicorn.run(app, host="127.0.0.1", port=8000)
