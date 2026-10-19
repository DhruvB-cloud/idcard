# serve.py - a tiny local web server for TESTING the site on your own computer.
# Run it from this folder with:   python serve.py
# Then open http://localhost:8000 in your browser.  Stop it with Ctrl + C.
#
# Why not plain "python -m http.server"?  That one lets the browser keep (cache) old copies
# of files, so after you edit data.js or style.css you may still see the OLD version.
# This one tells the browser "never keep a copy", so a normal refresh always shows your latest edits.
# (GitHub Pages doesn't use this file - it's only for local testing.)

import http.server                                         # Python's built-in web server tools

PORT = 8000                                                # The "door number": the site is at http://localhost:8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):  # Same as the normal file server, plus one change below...
    def end_headers(self):                                 # ...runs just before each file is sent to the browser
        self.send_header("Cache-Control", "no-store")      # "no-store" = browser must not save a copy, always ask again
        super().end_headers()                              # Then carry on exactly as the normal server would


# ThreadingHTTPServer answers several browser connections AT THE SAME TIME (each in its own "thread").
# A one-at-a-time server can freeze: browsers often open a spare connection in advance and leave it idle,
# and a single-threaded server would sit waiting on that idle connection while your page never loads.
with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), NoCacheHandler) as server:  # 127.0.0.1 = only this computer can connect
    print(f"Serving on http://localhost:{PORT}  (Ctrl + C to stop)")
    server.serve_forever()                                 # Keep answering browser requests until stopped
