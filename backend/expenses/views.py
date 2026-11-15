
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from django.db.models import Sum, Q
from django.db.models.functions import TruncMonth

from .models import Transaction, MonthlyBudget

from .serializers import (
    TransactionSerializer,
    UserRegistrationSerializer,
    MonthlyBudgetSerializer
)


# Transaction List and Create
class TransactionListCreateView(generics.ListCreateAPIView):

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            user=self.request.user
        ).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Transaction Update and Delete
class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):

    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(
            user=self.request.user
        )


# User Registration
class UserRegistrationView(generics.CreateAPIView):

    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]


# Dashboard Summary
class DashboardSummaryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        transactions = Transaction.objects.filter(
            user=request.user
        )

        summary = transactions.aggregate(
            total_income=Sum(
                'amount',
                filter=Q(transaction_type='income')
            ),
            total_expenses=Sum(
                'amount',
                filter=Q(transaction_type='expense')
            )
        )

        income = summary['total_income'] or 0
        expenses = summary['total_expenses'] or 0

        balance = income - expenses

        return Response({
            'total_income': income,
            'total_expenses': expenses,
            'balance': balance
        })


# Category Summary
class CategorySummaryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        summary = (
            Transaction.objects
            .filter(
                user=request.user,
                transaction_type='expense'
            )
            .values('category')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        return Response(summary)


# Monthly Expense Summary
class MonthlyExpenseSummaryView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        summary = (
            Transaction.objects
            .filter(
                user=request.user,
                transaction_type='expense'
            )
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        result = [
            {
                'month': item['month'].strftime('%Y-%m'),
                'total_expenses': item['total']
            }
            for item in summary
        ]

        return Response(result)


# Monthly Budget List and Create
class MonthlyBudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MonthlyBudget.objects.filter(
            user=self.request.user
        ).order_by('-month')

    def perform_create(self, serializer):
        serializer.instance, created = MonthlyBudget.objects.update_or_create(
            user=self.request.user,
            month=serializer.validated_data['month'],
            defaults={
                'budget_amount': serializer.validated_data['budget_amount']
            }
        )

class MonthlyBudgetDetailView(generics.DestroyAPIView):
    serializer_class = MonthlyBudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MonthlyBudget.objects.filter(
            user=self.request.user
        )