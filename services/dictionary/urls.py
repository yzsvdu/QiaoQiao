from django.urls import path
from dictionary.controllers.service import find_example_sentences, get_pinyin

urlpatterns = [
    path('dictionary/examples/', find_example_sentences, name='example_sentences_endpoint'),
    path('dictionary/pinyin/', get_pinyin, name='get_pinyin_endpoint')
]