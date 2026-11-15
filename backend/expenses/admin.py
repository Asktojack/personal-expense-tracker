
from django.contrib import admin
from .models import Transaction, MonthlyBudget


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'title',
        'amount',
        'transaction_type',
        'category',
        'date',
        'user'
    )


@admin.register(MonthlyBudget)
class MonthlyBudgetAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'month',
        'budget_amount',
        'created_at'
    )

    list_filter = ('month', 'user')
