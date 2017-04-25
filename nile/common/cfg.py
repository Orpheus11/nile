import ConfigParser

class Ops_cofig(ConfigParser.ConfigParser):
    def __call__(self, conf_path):
        self.read(conf_path)


CONF = Ops_cofig()