
from django.db import models
from django.contrib.auth.models import User


class Transaction(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions',
        null=True,
        blank=True
    )

    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    title = models.CharField(max_length=100)

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES
    )

    category = models.CharField(max_length=50)

    description = models.TextField(blank=True, null=True)

    date = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MonthlyBudget(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='monthly_budgets'
    )

    month = models.DateField(
        help_text="Use the first day of the month, e.g. 2026-11-01"
    )

    budget_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'month')

    def __str__(self):
        return f"{self.user.username} - {self.month}"
