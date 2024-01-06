from django.core.cache import cache
from django.http import JsonResponse
import requests
from pypinyin import pinyin, Style
from dictionary.helpers.youdou_api import YoudouAPI

MAX_CACHE_ENTRIES = 100  # Set your desired maximum number of entries


def find_example_sentences(request):
    query = request.GET.get("query")

    # Check if the data is already cached in the cache
    cached_data = cache.get(query)

    if not cached_data:
        signature_seed = "lj:" + query

        youdou_api_instance = YoudouAPI()
        signature = youdou_api_instance.generate_signature(query=signature_seed)
        data = youdou_api_instance.load_payload(query=query, signature=signature)

        response = requests.post(YoudouAPI.url, headers=YoudouAPI.headers, data=data)

        if response.status_code == 200:
            response_data = youdou_api_instance.parse_for_sentences(response)

            # Cache the data with a limited number of entries
            cached_entries = cache.get('cached_entries', [])
            cached_entries.append(response_data)

            if len(cached_entries) > MAX_CACHE_ENTRIES:
                cached_entries.pop(0)  # Remove the oldest entry

            cache.set(query, response_data)
            cache.set('cached_entries', cached_entries)

            return JsonResponse(response_data)

    else:
        return JsonResponse(cached_data)

    return JsonResponse({'sentence_pairs': []})


def get_pinyin(request):
    query = request.GET.get("query")
    pinyin_result = pinyin(query, style=Style.TONE3, heteronym=True, strict=False)
    return JsonResponse({'pinyin': pinyin_result})

