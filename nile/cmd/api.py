from nile.cmd.common import launch, get_worker_count

def main():
    workers = get_worker_count()
    launcher = launch('nile', '8080', host='0.0.0.0', workers=workers)
    launcher.wait()


import sys
if __name__ == "__main__":
    sys.exit(main())
