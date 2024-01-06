import hashlib

import jieba
from pypinyin import pinyin, Style

w = "Mk6hqtUp33DGGtoS63tTJbMUYjRrG1Lu"
v = "webdict"
_ = "web"


class YoudouAPI:
    w = "Mk6hqtUp33DGGtoS63tTJbMUYjRrG1Lu"
    v = "webdict"
    _ = "web"

    url = 'https://dict.youdao.com/jsonapi_s?doctype=json&jsonversion=4'

    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'OUTFOX_SEARCH_USER_ID_NCOO=483424911.3218543; OUTFOX_SEARCH_USER_ID=-324360100@10.99.107.21',
        'Origin': 'https://youdao.com',
        'Pragma': 'no-cache',
        'Referer': 'https://youdao.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
    }

    def __init__(self):
        pass

    def generate_signature(self, query):
        time = len(query + v) % 10
        r = query + v
        o = hashlib.md5(r.encode()).hexdigest()
        n = _ + query + str(time) + w + o
        f = hashlib.md5(n.encode()).hexdigest()
        return f

    def load_payload(self, query, signature):
        time = len("lj:" + query + v) % 10
        data = {
            'q': f'lj:{query}',
            'le': 'en',
            't': f'{time}',
            'client': 'web',
            'sign': f'{signature}',
            'keyfrom': 'webdict',
        }
        return data

    def parse_for_sentences(self, response):
        json_data = response.json()
        blng_sents = json_data.get('blng_sents', {})
        if 'sentence-pair' in blng_sents:
            sentence_pairs = blng_sents['sentence-pair']
            pairs_list = []

            for pair in sentence_pairs:
                chinese_sentence = pair.get('sentence', '')
                chinese_sentence_tokenized = list(jieba.cut(chinese_sentence, cut_all=False))
                pinyin_sentence_tokenized = []

                for token in chinese_sentence_tokenized:
                    pinyin_result = pinyin(token, style=Style.TONE3, heteronym=True, strict=False)
                    pinyin_str = "".join(p[0] for p in pinyin_result)
                    pinyin_sentence_tokenized.append(pinyin_str)

                english_sentence = pair.get('sentence-translation', '')
                pairs_list.append({'chinese': chinese_sentence_tokenized, 'pinyin': pinyin_sentence_tokenized,
                                   'english': english_sentence})

            response_data = {'sentence_pairs': pairs_list}
            return response_data

        return {'sentence_pairs': []}

