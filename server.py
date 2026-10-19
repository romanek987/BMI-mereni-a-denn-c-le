import http.server
import socketserver
import os

# Render.com předává port dynamicky v proměnné prostředí PORT
PORT = int(os.environ.get("PORT", 8000))

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Přidání hlaviček pro správné kódování a cache
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        super().end_headers()

def main():
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
        print(f"FitPulse server běží na portu {PORT}...")
        httpd.serve_forever()

if __name__ == "__main__":
    main()
