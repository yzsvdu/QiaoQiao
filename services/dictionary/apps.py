from django.apps import AppConfig
import jieba
class DictionaryServiceConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'dictionary'

    def ready(self):
        jieba.initialize()