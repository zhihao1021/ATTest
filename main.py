from bs4 import BeautifulSoup, Tag
from requests import get
from json import dump

def eniipw(iipw: str, ipw_key: str,):
    """
    明文加密。

    iipw: :class:`str`
        身分證字號(不含英文)。
    ipw_key: :class:`str`
        金鑰組。
    """
    iipw = map(ord, iipw)
    ipw_key = map(int, ipw_key)
    return ",".join(map(lambda x, y: str(x * (y + 1) - 3 * y), iipw, ipw_key))

def deiipw(en_iipw: str, ipw_key: str,):
    """
    密文解密。

    en_iipw: :class:`str`
        密文。
    ipw_key: :class:`str`
        金鑰組。
    """
    en_iipw = map(int, en_iipw.strip(",").split(","))
    ipw_key = map(int, ipw_key)
    return "".join(map(lambda x, y: chr((x + 3 * y) // (y + 1)), en_iipw, ipw_key))

def ics(iTag: str):
    def chr_t(inp: str):
        inp = inp.split(".")
        num_1 = int(inp[0])
        num_2 = int(inp[1][1:])
        return chr(num_1 - num_2 - 273)
    return "".join(map(chr_t, iTag.strip(";").split(";"))) + "?checkFromHomeIndex"

def _retouch_checkPermitHome(div_element: Tag):
    _func = div_element["onclick"].removeprefix("checkPermitHome")
    _func = _func.replace("\'", "\"").strip("\",()")
    _data_list = _func.split("\",\"")
    _data_list = tuple(map(lambda x: x.strip("\",()"), _data_list))

    return _data_list

PID_DICT = ["BNZ", "AMW", "KLY", "JVX", "HU", "GT", "FS", "ER", "DOQ", "CIP"]
OFF = [8, 7, 6, 5, 4, 3, 2, 1, 1]

if __name__ == "__main__":
    _soup = BeautifulSoup(get("http://163.27.13.221").content, features="html.parser")
    open("out.html", mode="wb").write(_soup.prettify().encode())

    _user_box = _soup.select("div.itemDiv")
    _user_data = map(_retouch_checkPermitHome, _user_box)
    _user_name = map(lambda x: x.select_one("u").text, _user_box)
    out_data = []
    for _name, _data in zip(_user_name, _user_data):
        try:
            out_data.append({})
            out_data[-1]["name"] = _name
            out_data[-1]["ipw"] = _data[0]
            if len(_data) > 1:
                out_data[-1]["ipw_key"] = _data[1]
                out_data[-1]["iTag"] = _data[2]
                out_data[-1]["link"] = ics(_data[2])
                out_data[-1]["pid"] = deiipw(_data[0], _data[1])
                _pid = map(int, out_data[-1]["pid"])
                out_data[-1]["pid_poss"] = PID_DICT[(10 - sum(list(map(lambda x: x[0] * x[1], zip(_pid, OFF)))) % 10) % 10]
            elif ";" in _data[0]:
                out_data[-1]["iTag"] = _data[0]
                out_data[-1]["link"] = ics(_data[0])
            else:
                raise RuntimeError
        except:
            print(_name, _data)
    dump(out_data, open("out.json", mode="w", encoding="utf-8"), indent=2, ensure_ascii=False, sort_keys=False)
    # open("out.json", mode="wb").write(dumps(out_data, option=OPT_INDENT_2))