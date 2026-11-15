
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Transaction, MonthlyBudget


class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class MonthlyBudgetSerializer(serializers.ModelSerializer):

    class Meta:
        model = MonthlyBudget
        fields = '__all__'
        read_only_fields = ['id', 'user', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
