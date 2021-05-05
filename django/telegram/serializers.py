from rest_framework import serializers


class TelegramMessageChatSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    type = serializers.ChoiceField(choices=['private'])

class TelegramMessageSerializer(serializers.Serializer):
    message_id = serializers.IntegerField()
    date = serializers.IntegerField()  # TODO or better DateTimeField?
    chat = TelegramMessageChatSerializer()
    text = serializers.CharField()

class TelegramUpdateSerializer(serializers.Serializer):
    update_id = serializers.IntegerField()
    message = TelegramMessageSerializer()
