"""
Production entry point. Run this instead of app.py directly.
...
"""
from waitress import serve
from app import app

if __name__ == "__main__":
    # host="127.0.0.1" -- only reachable from this machine, not the
    # public IP directly. That's fine now: Caddy sits in front on
    # 80/443 and reverse-proxies to this port. Waitress no longer
    # needs to be exposed publicly itself.
    #
    # port=8000 -- internal-only port, freeing up port 80 for Caddy.
    #
    # threads=8 lets Waitress handle multiple requests concurrently.
    print("Starting production server on http://127.0.0.1:8000 ...")
    serve(app, host="127.0.0.1", port=8000, threads=8)