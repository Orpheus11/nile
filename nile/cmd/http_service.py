import BaseHTTPServer
import threading
import logging
LOG = logging.getLogger(__name__)

class Request(BaseHTTPServer.BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
    def do_POST(self):
        self.send_response(200)

def thread_function(host,port):
    try:
        server = BaseHTTPServer.HTTPServer((host,port),Request)
        server.serve_forever()
    except Exception,e:
        LOG.debug("thread_function exception %s" % e)
        server.server_close()
    finally:
        LOG.debug("thread_function exit...")

def create_thread(host,port):
    th = threading.Thread(target=thread_function,args=(host,port))
    th.start()