import os, json

class api:
    path = "/home/vova/Music/"


    def __init__(self):
        pass

    def path_to_dict(self, path):
        d = {'name': os.path.basename(path)}
        if os.path.isdir(path):
            d['type'] = "dir"
            d['text'] = path[path.rfind("/")+1:]
            d['children'] = [self.path_to_dict(os.path.join(path, x)) for x in os.listdir(path)]
        else:
            d['type'] = "file"
            d['text'] = path[path.rfind("/")+1:]
            d['path'] = path

        return d

    def getFileTree(self):
        return json.dumps(self.path_to_dict(self.path))



# eyed3 (audio), file tree, howler (html audio)
