import ConfigParser

class Ops_cofig(ConfigParser.ConfigParser):
    def __call__(self, conf_path):
        self.read(conf_path)

    def __getattr__(self, item):
        try:
            return self.get('DEFAULT', item)
        except Exception:
            return None



CONF = Ops_cofig()