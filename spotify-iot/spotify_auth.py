# spotify_auth.py
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import webbrowser, ssl, os

CLIENT_ID    = "a27dbb6c6444492380abf8f5176c97be"
REDIRECT_URI = "http://127.0.0.1:8888/callback"

AUTH_URL = (
    "https://accounts.spotify.com/authorize"
    f"?client_id={CLIENT_ID}"
    "&response_type=code"
    f"&redirect_uri={REDIRECT_URI}"
    "&scope=user-read-currently-playing%20user-read-playback-state"
)

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        params = parse_qs(urlparse(self.path).query)
        if "code" in params:
            code = params["code"][0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"<h2>Done! Check your terminal for the code.</h2>")
            print("\n========================================")
            print("PASTE THIS INTO ESP32 SERIAL MONITOR:")
            print(code)
            print("========================================")
        else:
            self.send_response(400)
            self.end_headers()
    def log_message(self, *args): pass

if not os.path.exists("cert.pem"):
    os.system('openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"')

httpd = HTTPServer(("localhost", 8888), Handler)
ctx = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ctx.load_cert_chain("cert.pem", "key.pem")
httpd.socket = ctx.wrap_socket(httpd.socket, server_side=True)
print("Opening Spotify login in browser...")
webbrowser.open(AUTH_URL)
print("Waiting... (if browser shows SSL warning: Advanced > Proceed)")
httpd.handle_request()